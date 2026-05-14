const { performance } = require('perf_hooks');

async function measureThroughput() {
  const startTime = performance.now();

  // Simulate multiple transactions
  const numTransactions = 100;
  const promises = [];

  for (let i = 0; i < numTransactions; i++) {
    promises.push(simulateTransaction());
  }

  await Promise.all(promises);

  const endTime = performance.now();
  const throughput = numTransactions / ((endTime - startTime) / 1000);
  console.log(`Throughput: ${throughput} transactions/second`);

  return throughput;
}

async function simulateTransaction() {
  // Simulate a transaction
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, 100);
  });
}

module.exports = { measureThroughput, simulateTransaction };