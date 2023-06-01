const request = require('request');


module.exports = (req, res, connection) => {
  // Replace the "demo" apikey below with your own key from https://www.alphavantage.co/support/#api-key
  const apiKey = process.env.API_KEY;
  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&apikey=${apiKey}`;

  request.get({
    url: url,
    json: true,
    headers: { 'User-Agent': 'request' }
  }, (err, res, data) => {
    if (err) {
      console.log('Error:', err);
    } else if (res.statusCode !== 200) {
      console.log('Status:', res.statusCode);
      console.log(res.body);
      const openValues = [];
      for (const date in timeSeries) {
        if (timeSeries.hasOwnProperty(date)) {
          const entry = timeSeries[date];
          const open = parseFloat(entry['1. open']);
          openValues.push(open);
        }
      };
    } else {
      // Data is successfully parsed as a JSON object
      console.log(data);
    }
  });
}