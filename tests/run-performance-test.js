const { measureThroughput } = require('./performance.test');
const { printReport } = require('./performance.test');

async function runPerformanceTest() {
  console.log('Starting performance test...');

  try {
    const report = await measureThroughput();
    printReport(report);
    console.log('Performance test completed.');
  } catch (error) {
    console.error('Performance test failed:', error);
    process.exitCode = 1;
  }
}

runPerformanceTest();
