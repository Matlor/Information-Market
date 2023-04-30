// This is the official Ledger interface that is guaranteed to be backward compatible.
module {
    // Amount of tokens, measured in 10^-8 of a token.
    public type Tokens = {
        e8s : Nat64;
    };

    // Number of nanoseconds from the UNIX epoch in UTC timezone.
    public type TimeStamp = {
        timestamp_nanos: Nat64;
    };

    // AccountIdentifier is a 32-byte array.
    // The first 4 bytes is big-endian encoding of a CRC32 checksum of the last 28 bytes.
    public type AccountIdentifier = Blob;

    // Subaccount is an arbitrary 32-byte byte array.
    // Ledger uses subaccounts to compute the source address, which enables one
    // principal to control multiple ledger accounts.
    public type SubAccount = Blob;

    // Sequence number of a block produced by the ledger.
    public type BlockIndex = Nat64;

    // An arbitrary number associated with a transaction.
    // The caller can set it in a `transfer` call as a correlation identifier.
    public type Memo = Nat64;

    // Arguments for the `transfer` call.
    public type TransferArgs =  {
        // Transaction memo.
        // See comments for the `Memo` type.
        memo: Memo;
        // The amount that the caller wants to transfer to the destination address.
        amount: Tokens;
        // The amount that the caller pays for the transaction.
        // Must be 10000 e8s.
        fee: Tokens;
        // The subaccount from which the caller wants to transfer funds.
        // If null, the ledger uses the default (all zeros) subaccount to compute the source address.
        // See comments for the `SubAccount` type.
        from_subaccount:  ?SubAccount;
        // The destination account.
        // If the transfer is successful, the balance of this address increases by `amount`.
        to: AccountIdentifier;
        // The point in time when the caller created this request.
        // If null, the ledger uses current IC time as the timestamp.
        created_at_time:  ?TimeStamp;
    };

    public type TransferError =  {
        // The fee that the caller specified in the transfer request was not the one that ledger expects.
        // The caller can change the transfer fee to the `expected_fee` and retry the request.
        #BadFee : { expected_fee : Tokens; };
        // The account specified by the caller doesn't have enough funds.
        #InsufficientFunds : { balance: Tokens; };
        // The request is too old.
        // The ledger only accepts requests created within 24 hours window.
        // This is a non-recoverable error.
        #TxTooOld : { allowed_window_nanos: Nat64 };
        // The caller specified `created_at_time` that is too far in future.
        // The caller can retry the request later.
        #TxCreatedInFuture;
        // The ledger has already executed the request.
        // `duplicate_of` field is equal to the index of the block containing the original transaction.
        #TxDuplicate : { duplicate_of: BlockIndex; }
    };

    public type TransferResult =  {
        #Ok : BlockIndex;
        #Err : TransferError;
    };


    // Arguments for the `account_balance` call.
    public type AccountBalanceArgs =  {
        account: AccountIdentifier;
    };

    public type TransferFeeArg = {};

    public type TransferFee =  {
        // The fee to pay to perform a transfer
        transfer_fee: Tokens;
    };

    public type GetBlocksArgs =  {
        // The index of the first block to fetch.
        start : BlockIndex;
        // Max number of blocks to fetch.
        length : Nat64;
    };

    public type Operation =  {
        #Mint : {
            to : AccountIdentifier;
            amount : Tokens;
        };
        #Burn : {
            from : AccountIdentifier;
            amount : Tokens;
        };
        #Transfer : {
            from : AccountIdentifier;
            to : AccountIdentifier;
            amount : Tokens;
            fee : Tokens;
        };
    };

    public type Transaction =  {
        memo : Memo;
        operation :  ?Operation;
        created_at_time : TimeStamp;
    };

    public type Block =  {
        parent_hash :  ?Blob;
        transaction : Transaction;
        timestamp : TimeStamp;
    };

    // A prefix of the block range specified in the [GetBlocksArgs] request.
    public type BlockRange =  {
        // A prefix of the requested block range.
        // The index of the first block is equal to [GetBlocksArgs.from].
        //
        // Note that the number of blocks might be less than the requested
        // [GetBlocksArgs.len] for various reasons, for example:
        //
        // 1. The query might have hit the replica with an outdated state
        //    that doesn't have the full block range yet.
        // 2. The requested range is too large to fit into a single reply.
        //
        // NOTE: the list of blocks can be empty if:
        // 1. [GetBlocksArgs.len] was zero.
        // 2. [GetBlocksArgs.from] was larger than the last block known to the canister.
        blocks :  [Block];
    };

    // An error indicating that the arguments passed to [QueryArchiveFn] were invalid.
    public type QueryArchiveError =  {
        // [GetBlocksArgs.from] argument was smaller than the first block
        // served by the canister that received the request.
        #BadFirstBlockIndex : {
            requested_index : BlockIndex;
            first_valid_index : BlockIndex;
        };

        // Reserved for future use.
        #Other : {
            error_code : Nat64;
            error_message : Text;
        };
    };

    public type QueryArchiveResult =  {
        // Successfully fetched zero or more blocks.
        #Ok : BlockRange;
        // The [GetBlocksArgs] request was invalid.
        #Err : QueryArchiveError;
    };

    // A function that is used for fetching archived ledger blocks.
    public type QueryArchiveFn = query (GetBlocksArgs) -> async (QueryArchiveResult);

    // The result of a "query_blocks" call.
    //
    // The structure of the result is somewhat complicated because the main ledger canister might
    // not have all the blocks that the caller requested: One or more "archive" canisters might
    // store some of the requested blocks.
    //
    // Note: as of Q4 2021 when this interface is authored, the IC doesn't support making nested 
    // query calls within a query call.
    public type QueryBlocksResponse =  {
        // The total number of blocks in the chain.
        // If the chain length is positive, the index of the last block is `chain_len - 1`.
        chain_length : Nat64;

        // System certificate for the hash of the latest block in the chain.
        // Only present if `query_blocks` is called in a non-replicated query conText.
        certificate :  ?Blob;

        // List of blocks that were available in the ledger when it processed the call.
        //
        // The blocks form a contiguous range, with the first block having index
        // [first_block_index] (see below), and the last block having index
        // [first_block_index] + len(blocks) - 1.
        //
        // The block range can be an arbitrary sub-range of the originally requested range.
        blocks :  [Block];

        // The index of the first block in "blocks".
        // If the blocks vector is empty, the exact value of this field is not specified.
        first_block_index : BlockIndex;

        // Encoding of instructions for fetching archived blocks whose indices fall into the
        // requested range.
        //
        // For each entry `e` in [archived_blocks], `[e.from, e.from + len)` is a sub-range
        // of the originally requested block range.
        archived_blocks : [{
            // The index of the first archived block that can be fetched using the callback.
            start : BlockIndex;

            // The number of blocks that can be fetch using the callback.
            length : Nat64;

            // The function that should be called to fetch the archived blocks.
            // The range of the blocks accessible using this function is given by [from]
            // and [len] fields above.
            callback : QueryArchiveFn;
        }];
    };

    public type Archive =  {
        canister_id: Principal;
    };

    public type Archives =  {
        archives: [Archive];
    };

    public type Interface = actor {
        // Transfers tokens from a subaccount of the caller to the destination address.
        // The source address is computed from the principal of the caller and the specified subaccount.
        // When successful, returns the index of the block containing the transaction.
        transfer : (TransferArgs) -> async (TransferResult);

        // Returns the amount of Tokens on the specified account.
        account_balance : query(AccountBalanceArgs) -> async (Tokens) ;

        // Returns the current transfer_fee.
        transfer_fee : query(TransferFeeArg) -> async (TransferFee) ;

        // Queries blocks in the specified range.
        query_blocks : query(GetBlocksArgs) -> async (QueryBlocksResponse) ;

        // Returns token symbol.
        symbol : query () ->  async ({ symbol: Text }) ;

        // Returns token name.
        name :query () ->  async ({ name: Text }) ;

        // Returns token decimals.
        decimals : query() ->  async ({ decimals: Nat32 }) ;

        // Returns the existing archive canisters information.
        archives :query () -> async (Archives) ;
    }


};