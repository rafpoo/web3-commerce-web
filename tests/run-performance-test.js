const { measureThroughput } = require('./performance.test');

async function runPerformanceTest() {
  console.log('Starting performance test...');

  try {
    const throughput = await measureThroughput();
    console.log(`Performance test completed. Throughput: ${throughput} transactions/second`);
  } catch (error) {
    console.error('Performance test failed:', error);
  }
}

runPerformanceTest();