class Transaction {
    constructor (fromAccountId,toAccountId,amount,currency) {
        this.fromAccountId = fromAccountId;
        this.toAccountId = toAccountId;
        this.amount = amount;
        this.currency = currency;
    }
}

module.exports = {
    Transaction
}