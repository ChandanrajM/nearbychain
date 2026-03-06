const algosdk = require("algosdk");

const algodServer = "https://testnet-api.algonode.cloud";

const algodClient = new algosdk.Algodv2('', algodServer, '');

async function createPayment(sender,receiver,amount,secretKey){

  const params = await algodClient.getTransactionParams().do();

  const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({

    sender: sender,
    receiver: receiver,
    amount: amount,
    suggestedParams: params

  });

  const signedTxn = txn.signTxn(secretKey);

  const tx = await algodClient.sendRawTransaction(signedTxn).do();

  return tx.txId;

}

module.exports = createPayment;