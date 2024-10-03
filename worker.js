const { parentPort } = require("worker_threads");
const { sendTransaction, validateTransaction } = require("./controllers/transactionService");

parentPort.on('message',(tx) => {
    try {
        validateTransaction(tx);
        sendTransaction(tx);
        parentPort.postMessage({status:"success",tx});
    } catch (error) {
        parentPort.postMessage({status:"error",error:error.message})
    }
})