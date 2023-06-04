const request = require('request');

module.exports = (symbol, updateChart) => {
  // Replace the "demo" apikey below with your own key from https://www.alphavantage.co/support/#api-key
  const apiKey = process.env.API_KEY;
  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=${apiKey}`;

  request.get({
    url: url,
    json: true,
    headers: { 'User-Agent': 'request' }
  }, (err, response, data) => {
    if (err) {
      console.log('Error:', err);
    } else if (response.statusCode !== 200) {
      console.log('Status:', response.statusCode);
      console.log(response.body);
    } else {
      // Data is successfully parsed as a JSON object
      console.log(data);
      // Pass the retrieved data to the updateChart function
      updateChart(data);
    }
  });
};
