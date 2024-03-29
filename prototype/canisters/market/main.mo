import InvoiceTypes  "../invoice/types";
import Types         "types";
import Utils         "utils";

import Debug         "mo:base/Debug";
import Int           "mo:base/Int";
import Int32         "mo:base/Int32";
import Iter          "mo:base/Iter";
import Nat           "mo:base/Nat";
import Nat32         "mo:base/Nat32";
import Nat64         "mo:base/Nat64";
import Option        "mo:base/Option";
import Principal     "mo:base/Principal";
import Result        "mo:base/Result";
import Time          "mo:base/Time";

import GraphQL      "canister:graphql";


shared({ caller = initializer }) actor class Market(arguments: Types.InstallMarketParams) = this {

  // ------------------------- Members -------------------------

  private let invoice_canister_ : InvoiceTypes.Interface = actor (Principal.toText(arguments.invoice_canister));
  private let coin_symbol_ : Text = arguments.coin_symbol;
  private var min_reward_ : Nat = arguments.min_reward_e8s;
  private var fee_ : Nat = arguments.transfer_fee_e8s;
  private var duration_pick_answer_ : Int32 = arguments.pick_answer_duration_minutes;
  private var duration_disputable_ : Int32 = arguments.disputable_duration_minutes;

  // ------------------------- Getters -------------------------

  public shared func get_coin_symbol() : async Text {
    return coin_symbol_;
  };

  public shared func get_min_reward() : async Nat {
    return min_reward_;
  };

  public shared func get_fee() : async Nat {
    return fee_;
  };

  public shared func get_duration_pick_answer() : async Int32 {
    return duration_pick_answer_;
  };

  public shared func get_duration_disputable() : async Int32 {
    return duration_disputable_;
  };

  // ------------------------- Update market params -------------------------

  public shared({caller}) func update_market_params(params: Types.UpdateMarketParams) : async Result.Result<(), Types.Error>{
    if (caller != initializer){
      return #err(#NotAllowed);
    };
    min_reward_ := Option.get(params.min_reward_e8s, min_reward_);
    fee_ := Option.get(params.transfer_fee_e8s, fee_);
    duration_pick_answer_ := Option.get(params.pick_answer_duration_minutes, duration_pick_answer_);
    duration_disputable_ := Option.get(params.disputable_duration_minutes, duration_disputable_);
    return #ok;
  };

  // ------------------------- Create User -------------------------

  public shared ({caller}) func create_user(name: Text, avatar: Text) : async Result.Result<GraphQL.UserType, Types.Error> {
    let user_id = Principal.toText(caller);
    switch (await GraphQL.get_user(user_id)){
      case(?user){
        return #err(#UserExists);
      };
      case(null){
        switch (await GraphQL.create_user(user_id, name, Utils.time_minutes_now(), avatar)){
          case(null) {
            return #err(#GraphQLError);
          };
          case (?user) {
            return #ok(user);
          };
        };
      };
    };
  };

  // ------------------------- Update User -------------------------

  public shared ({caller}) func update_user(name: Text, avatar: Text) : async Result.Result<GraphQL.UserType, Types.Error> {
    let user_id = Principal.toText(caller);
    switch (await GraphQL.get_user(user_id)){
      case(null){
        return #err(#UserNotFound);
      };
      case(?user){
        switch (await GraphQL.update_user(user_id, name, avatar)){
          case(null) {
            return #err(#GraphQLError);
          };
          case (?user) {
            return #ok(user);
          };
        };
      };
    };
  };

  // ------------------------- Create Invoice -------------------------

  public shared ({caller}) func create_invoice(reward: Nat) : async InvoiceTypes.CreateInvoiceResult  {
    if(reward < min_reward_) {
      let invoice_error : InvoiceTypes.CreateInvoiceErr = {
        kind = #Other;
        message = ?"Set reward is below minimum";
      };
      return #err(invoice_error);
    } else {
      let create_invoice_args : InvoiceTypes.CreateInvoiceArgs = {
        amount = reward + fee_;
        details = null;
        permissions = null;
        token = { 
          symbol = coin_symbol_;
        };
      };
      switch (await GraphQL.get_user(Principal.toText(caller))){
        case(null){
          let invoice_error : InvoiceTypes.CreateInvoiceErr = {
            kind = #Other;
            message = ?"Unknown user";
          };
          return #err(invoice_error);
        };
        case(?user){
          switch (await invoice_canister_.create_invoice(create_invoice_args)){
            case (#err create_invoice_err) {
              return #err(create_invoice_err);
            };
            case (#ok create_invoice_success) {
              switch (await GraphQL.create_invoice(
                Nat.toText(create_invoice_success.invoice.id),
                user.id
              )){
                case (null) {
                  let invoice_error : InvoiceTypes.CreateInvoiceErr = {
                    kind = #Other;
                    message = ?"GraphQL error";
                  };
                  return #err(invoice_error);
                };
                case (?invoice) {
                  return #ok(create_invoice_success);
                };
              };
            };
          };
        };
      };
    };
  };

  // ------------------------- Ask Question -------------------------

  public shared ({caller}) func ask_question (
    invoice_id: Nat,
    duration_minutes: Int32,
    title: Text,
    content: Text
  ) : async Result.Result<GraphQL.QuestionType, Types.Error> {
    // Verify that the invoice exists in database
    switch (await GraphQL.get_invoice(Nat.toText(invoice_id))){
      case (null) {
        return #err(#NotFound);
      };
      case (?graphql_invoice) {
        let author = Principal.toText(caller);
        // Verify the buyer of the invoice is the caller that is opening up the question
        // This also ensures that there is a user associated to the caller
        if (graphql_invoice.buyer.id != author) {
          return #err(#NotAllowed);
        } else {
          // Verify the invoice has been paid
          switch (await invoice_canister_.verify_invoice({id = invoice_id})) {
            case(#err err) {  
              return #err(#VerifyInvoiceError(err));
            };
            case(#ok verify_invoice_success){
              var invoice_amount : Nat = 0;
              switch(verify_invoice_success){
                case(#AlreadyVerified verified){
                  // If it has already been verified, check that no
                  // question already exists for this invoice
                  switch(await GraphQL.get_question_by_invoice(Nat.toText(invoice_id))){
                    case(?question){
                      return #err(#NotAllowed);
                    };
                    case(null){
                      invoice_amount := verified.invoice.amount;
                    };
                  };
                };
                case(#Paid paid){
                  invoice_amount := paid.invoice.amount;
                };
              };
              // Finally create the question
              let now = Utils.time_minutes_now();
              switch (await GraphQL.create_question(
                author,
                Nat.toText(invoice_id),
                now,
                now + duration_minutes,
                duration_minutes,
                title,
                content,
                Utils.e8s_to_e3s(invoice_amount - fee_)
              )){
                case(null) {
                  return #err(#GraphQLError);
                };
                case (?question) {
                  return #ok(question);
                };
              };
            };
          };
        };
      };
    };
  };
  
  // ------------------------- Answer Question -------------------------

  public shared ({caller}) func answer_question(
    question_id: Text,
    content: Text
  ): async Result.Result<GraphQL.AnswerType, Types.Error> {
    // Check the user is registred
    switch (await GraphQL.get_user(Principal.toText(caller))){
      case(null){
        return #err(#UserNotFound);
      };
      case(?user){
        // Check the question exists
        switch(await GraphQL.get_question(question_id)){
          case(null){
            return #err(#NotFound);
          };
          case(?question){
            // Verify one does not attempt to answer its own question
            if (question.author.id == user.id) {
              return #err(#NotAllowed);
            // Verify the question is open
            } else if (question.status != #OPEN) {
              return #err(#WrongStatus);
            } else {
              switch(await GraphQL.create_answer(
                question_id,
                user.id,
                Utils.time_minutes_now(),
                content
              )){
                case(null){
                  return #err(#GraphQLError);
                };
                case(?answer){
                  return #ok(answer);
                };
              };
            };
          };
        };
      };
    };
  };

  // ------------------------- Pick Winner -------------------------

  public shared ({caller}) func pick_winner(
    question_id: Text,
    answer_id: Text
    ) : async Result.Result<(), Types.Error> {
    switch(await GraphQL.get_question(question_id)){
       case(null){
        return #err(#NotFound);
      };
      case(?question){
        let now = Utils.time_minutes_now();
        if (question.author.id != Principal.toText(caller)) {
          return #err(#NotAllowed);
        } else if (question.status != #PICKANSWER) {
          return #err(#WrongStatus);
        } else if ((await GraphQL.get_answer(question_id, answer_id)) == null) {
          return #err(#NotFound);
        } else if (not (await GraphQL.pick_winner(question_id, answer_id, now, now + duration_disputable_))){
          return #err(#GraphQLError);
        } else {
          return #ok();
        };
      };
    };
  };

  // ------------------------- Trigger Dispute -------------------------

  // TO DO: opening a dispute shall cost a fee. This fee shall reward the arbitrator.
  public shared ({caller}) func trigger_dispute(
    question_id: Text
  ): async Result.Result<(), Types.Error> {
    switch(await GraphQL.get_question(question_id)){
       case(null){
        return #err(#NotFound);
      };
      case(?question){
        let now = Utils.time_minutes_now();
        if (question.status != #DISPUTABLE) {
          return #err(#WrongStatus);
        } else if (not(await GraphQL.has_answered(question_id, Principal.toText(caller)))) {
          return #err(#NotAllowed);
        } else if (not (await GraphQL.open_dispute(question_id, now))){
          return #err(#GraphQLError);
        } else {
          return #ok();
        };
      };
    };
  };

  // ------------------------- Arbitrate -------------------------

  // Centralised version: the contract deployer is the arbitrator
  public shared ({caller}) func arbitrate(
    question_id: Text,
    answer_id: Text
  ): async Result.Result<(), Types.Error> {
    if (caller != initializer){
      return #err(#NotAllowed);
    };
    switch(await GraphQL.get_question(question_id)){
       case(null){
        return #err(#NotFound);
      };
      case(?question){
        if (question.status != #DISPUTED) {
          return #err(#WrongStatus);
        } else {
          switch (await GraphQL.get_answer(question_id, answer_id)) {
            case (null) {
              return #err(#NotFound);
            };
            case (?answer) {
              switch(await transfer(Principal.fromText(answer.author.id), question.reward)){
                case(#err err){
                  return #err(err);
                };
                case(#ok block_height){
                  // Here there is in theory a severe risk that the transfer worked 
                  // but the question is not closed, hence it would be possible to have
                  // multiple transfers for the same question
                  // TO DO: use a hashmap <question_id, blockHeight> to store the transfer
                  // in motoko, to be able to ensure that the question has not already been paid
                  if(await GraphQL.solve_dispute(
                    question_id,
                    answer_id,
                    Nat64.toText(block_height),
                    Utils.time_minutes_now()
                  )){
                    return #ok();
                  } else {
                    Debug.print("Failed to reward the winner for question \"" # question.id # "\"");
                    return #err(#GraphQLError);
                  };
                };
              };
            };
          };
        };
      };
    };
  };

  // ------------------------- Update status -------------------------

  public func update_status() : async () {
    let now = Utils.time_minutes_now();
    let questions : [GraphQL.QuestionType] = await GraphQL.get_questions();
    for (question in Iter.fromArray<GraphQL.QuestionType>(questions)) {
      await update_question_status(question, now);
    };
  };

  private func update_question_status(question: GraphQL.QuestionType, now: Int32) : async () {
    if (now >= question.status_end_date) {
      switch(question.status){
        case(#OPEN){
          if (await GraphQL.has_answers(question.id)){
            let pick_answer_end = question.status_end_date + duration_pick_answer_;
            if (now >= pick_answer_end){
              // Automatically trigger a dispute if the author did not pick a winner
              Debug.print("Update question \"" # question.id # "\" status to DISPUTED");
              ignore await GraphQL.open_dispute(question.id, pick_answer_end);
            } else {
              // Update the question's state, the author must pick an answer
              Debug.print("Update question \"" # question.id # "\" status to PICKANSWER");
              ignore await GraphQL.must_pick_answer(question.id, question.status_end_date, pick_answer_end);
            }
          } else {
            // Refund the author if no answer has been given
            switch(await transfer(Principal.fromText(question.author.id), question.reward)){
              case(#ok block_height){
                // Here there is in theory a severe risk that the transfer worked 
                // but the question is not closed, hence it would be possible to have
                // multiple transfers for the same question
                // TO DO: use a hashmap <question_id, blockHeight> to store the transfer
                // in motoko, to be able to ensure that the question has not already been paid
                Debug.print("Update question \"" # question.id # "\" status to CLOSE");
                ignore await GraphQL.close_question(question.id, Nat64.toText(block_height), question.status_end_date);
              };
              case(_){
                Debug.print("Failed to reward the author for question \"" # question.id # "\"");
              };
            };
          };
        };
        case(#PICKANSWER){
          // Automatically trigger a dispute if the author did not pick a winner
          Debug.print("Update question \"" # question.id # "\" status to DISPUTED");
          ignore await GraphQL.open_dispute(question.id, question.status_end_date);
        };
        case(#DISPUTABLE){
          // If nobody disputed the picked answer, payout the answer's author
          // and close the question
          switch (question.winner) {
            case (null){
              // Nothing to do, it will never happen if we make sure the question 
              // is never put in DISPUTABLE state without having a winner
            };
            case (?answer){
              // Pay the winner
              switch(await transfer(Principal.fromText(answer.author.id), question.reward)){
                case(#ok block_height){
                  // Here there is in theory a severe risk that the transfer worked 
                  // but the question is not closed, hence it would be possible to have
                  // multiple transfers for the same question
                  // TO DO: use a hashmap <question_id, blockHeight> to store the transfer
                  // in motoko, to be able to ensure that the question has not already been paid
                  Debug.print("Update question \"" # question.id # "\" status to CLOSED");
                  ignore await GraphQL.close_question(question.id, Nat64.toText(block_height), question.status_end_date);
                };
                case(_){
                  Debug.print("Failed to reward the winner for question \"" # question.id # "\"");
                };
              };
            };
          };
        };
        case(_){
        };
      };
    };
  };

  // ------------------------- Transfer -------------------------
  
  private func transfer(to: Principal, amount_e3s: Int32) : async Result.Result<Nat64, Types.Error> {
    switch(Utils.getDefaultAccountIdentifier(to)){
      case (null) {
        return #err(#AccountIdentifierError);
      };
      case (?account_identifier) {
        // Watchout: use a #blob (for destination account) instead of a #principal because with the
        // principal the invoice canister transfer the funds to what seems to be an invoice subaccount...
        switch(await invoice_canister_.transfer({
          amount = Utils.e3s_to_e8s(amount_e3s);
          token = {symbol = coin_symbol_};
          destination = #blob(account_identifier);
        })){
          case(#err err){
            return #err(#TransferError(err));
          };
          case(#ok success){
            return #ok(success.blockHeight);
          };
        };
      };
    };
  };
  
};