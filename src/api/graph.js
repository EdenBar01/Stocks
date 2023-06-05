const express = require('express');
const router = express.Router();
const request = require('request');

router.post('/stocks', (req, res) => {
  const { symbol } = req.body;
  const apiKey = process.env.API_KEY;
  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=${apiKey}`;
  request.get({
    url: url,
    json: true,
    headers: { 'User-Agent': 'request' }
    }, (err, response, data) => {
      if (err) {
        console.log('Error:', err);
        res.json({ success: false, error: err });
      } else if (response.statusCode !== 200) {
        console.log('Status:', response.statusCode);
        res.json({ success: false, statusCode: response.statusCode, error: response.body });
      } else {
        // Data is successfully parsed as a JSON object
        console.log("api call successful")
        const openValues = Object.values(data['Time Series (5min)'])//.map(item => parseFloat(item['1. open']));
        res.json({success: true, object: openValues });
      }});
});

module.exports = router;
