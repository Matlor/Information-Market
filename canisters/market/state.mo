import Map             "mo:map/Map";
import Types           "types";
import Ref             "Ref";
import Time            "mo:base/Time";
import Hash            "mo:base/Hash";

module {
    
    type Map<K, V>           = Map.Map<K, V>;
    type Ref<V>              = Ref.Ref<V>;

    public type State = {
        creation_date                   : Time.Time;
        min_reward_                     : Ref<Nat32>;
        fee_                            : Ref<Nat32>;
        duration_pick_answer_           : Ref<Int32>; 
        duration_disputable_            : Ref<Int32>;
        update_status_on_heartbeat_     : Ref<Bool>;

        users : {
            register                    : Map<Principal, Types.User>;
        };

        invoices: {
            register                    : Map<Nat32, Types.Invoice>;
            index                       : Ref<Nat32>;
        };

        questions : {
            register                    : Map<Nat32, Types.Question>;
            index                       : Ref<Nat32>;
        };

        answers: {
            register                    : Map<Nat32, Types.Answer>;
            index                       : Ref<Nat32>;
        };
    };  

    public func initState(creation_date: Time.Time, parameters: Types.InstallMarketArguments) : State {
        {
            creation_date      = creation_date;
            min_reward_ = Ref.init<Nat32>(parameters.min_reward_e8s);
            fee_ = Ref.init<Nat32>(parameters.transfer_fee_e8s);
            duration_pick_answer_ = Ref.init<Int32>(parameters.pick_answer_duration_minutes); 
            duration_disputable_ = Ref.init<Int32>(parameters.disputable_duration_minutes);
            update_status_on_heartbeat_= Ref.init<Bool>(parameters.update_status_on_heartbeat);
            
            users = {
                register       = Map.new<Principal, Types.User>(Map.phash);
            };

            invoices = {
                register       = Map.new<Nat32, Types.Invoice>(Map.n32hash);
                index          = Ref.init<Nat32>(1);
            };

            questions = {
                register       = Map.new<Nat32, Types.Question>(Map.n32hash);
                index          = Ref.init<Nat32>(0);
            };

            answers = {
                register       = Map.new<Nat32, Types.Answer>(Map.n32hash);
                index          = Ref.init<Nat32>(0);
            };  
        };
    };
};