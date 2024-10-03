const accounts = {
    account1:{
        balance:1000
    },
    account2:{
        balance:500
    }
}

function validateTransaction(tx){
    const SUPPORTED_CURRENCIES = process.env.SUPPORTED_CURRENCIES
    if(!tx.fromAccountId || !tx.toAccountId){
        throw new Error("required accountId is not provided");
    }

    if(tx.amount <= 0){
        throw new Error("Amount must be Greater than 0");
    }
    
    if(!SUPPORTED_CURRENCIES.includes(tx.currency)){
        throw new Error("currency is not supported")
    }
}

function sendTransaction(tx){
    const toAccount = accounts[tx.toAccountId];
    const fromAccount = accounts[tx.fromAccountId];
    if(!fromAccount || !toAccount) {
        throw new Error("Account not Found");
    }

    if(fromAccount.balance < tx.amount) {
        throw new Error("Insufficient Funds")
    }

    fromAccount.balance -= tx.amount;
    toAccount.balance += tx.amount;
    console.log("Transaction Succesful",accounts);
}

async function logTransaction(tx) {
    const response = await fetch('http://localhost:3000/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tx),
    });
    
    if (!response.ok) {
      throw new Error('Failed to log transaction');
    }
}

module.exports = {
    sendTransaction,
    validateTransaction,
    logTransaction
}