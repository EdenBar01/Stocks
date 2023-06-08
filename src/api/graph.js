const express = require('express');
const router = express.Router();
const request = require('request');

router.post('/stocks', (req, res) => {
  const { stock, timePeriod, apiFunction, filter } = req.body;
  const apiKey = process.env.API_KEY;
  let url = `https://www.alphavantage.co/query?function=${apiFunction}&symbol=${stock}&apikey=${apiKey}`;
  if (apiFunction === "TIME_SERIES_INTRADAY") {
     url = url + `&interval=${timePeriod}`;
  }
  console.log(url);
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
        console.log("api call successful");
        console.log(filter);
        const metaData = Object.values(data)[0];
        const values = Object.values(data)[1]
        const stockPrice = Object.values(values).map(obj => obj[filter]).reverse();  //.map(//.map(item => parseFloat(item[info]));
        const label = Object.keys(values).reverse()
        console.log(label);
        console.log(stockPrice);
        res.json({success: true, stockPrice : stockPrice, label : label, metaData: metaData});
      }});
});

module.exports = router;
