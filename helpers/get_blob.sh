#!/usr/local/bin/ic-repl

import invoice = "r7inp-6aaaa-aaaaa-aaabq-cai";
import ledger = "rrkah-fqaaa-aaaaa-aaaaq-cai";


let invoiceRes = call invoice.accountIdentifierToBlob(variant {text = "050b3c5e08055d8ee5088483a99d9937834384089baf9a44c1532f637a0e6af8"});
let blobAccountId = invoiceRes.ok;
blobAccountId;


let ledgerRes = call ledger.account_balance(record { account = blob "\05\0b<^\08\05]\8e\e5\08\84\83\a9\9d\997\83C\84\08\9b\af\9aD\c1S/cz\0ej\f8" });
ledgerRes;


