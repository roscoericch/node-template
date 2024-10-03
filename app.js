const express = require("express");
const { Worker } = require("worker_threads");
const dotenv = require("dotenv");
const {Transaction} = require("./class/Transaction");
const {validateTransaction, logTransaction} = require("./controllers/transactionService");

dotenv.config();
const app = express();
app.use(express.json());

const WORKER_COUNT = process.env.WORKER_COUNT;

const workers = [];
let currentWorker = 0;

function createWorkerPool() {
    for (let i = 0; i < WORKER_COUNT; i++) {
      const worker = new Worker('./worker.js');
      worker.on('message', (message) => {
        if (message.status === 'success') {
          console.log('Transaction processed:', message.tx);
        } else {
          console.error('Error processing transaction:', message.error);
        }
      });
      workers.push(worker);
    }
}

function processTransaction(tx) {
    currentWorker = (currentWorker + 1) % WORKER_COUNT;
    workers[currentWorker].postMessage(tx);
}
  
createWorkerPool();

app.post('/transaction', async (req, res) => {
    const tx = new Transaction(
      req.body.fromAccountId,
      req.body.toAccountId,
      req.body.amount,
      req.body.currency
    );
  
    try {
      validateTransaction(tx);
      processTransaction(tx);
      await logTransaction(tx);
      res.status(200).json({ message: 'Transaction is being processed' });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
});

app.get('/transactions', async (req, res) => {
    const response = await fetch('http://localhost:3000/transactions');
    const transactions = await response.json();
    res.json(transactions);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});