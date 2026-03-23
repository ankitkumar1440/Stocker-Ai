const yahooFinance = require('yahoo-finance2').default;

async function test() {
  const result = await yahooFinance.chart('^NSEI', { interval: '5m', range: '1d' });
  console.log(result.meta.symbol, result.timestamp.length);
}
test();
