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

router.get('/stocks', (req, res) => {
  const { stockSymbol} = req.body;
  const apiKey = process.env.API_KEY;
  const apiFunction = "SYMBOL_SEARCH"
  let url = `https://www.alphavantage.co/query?function=${apiFunction}&keywords=${stockSymbol}&apikey={apiKey}`;
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
// router.post('/presentFavorites', (req, res) => {

//   const jwt = require('jsonwebtoken');
//   const { stock, timePeriod, info } = req.body;
//   const token = req.cookies.token;
//   const decoded = jwt.decode(token);
//   const user_id = decoded.id;
//   const query = 'SELECT stock FROM favorites WHERE user_id=(user_id) VALUES (?)';
//   connection.query(query, [user_id, stock, timePeriod, info], (err, result) => {
//     if (err) {
//       console.error('Error adding stock to favorites:', err);
//       res.status(500).json({ error: 'Failed to add stock to favorites' });
//       return;
//     }
//     // Return a success response
//     res.json({ success: true, message: 'Stock added to favorites' });
//   });
// });

router.post('/addToFavorites', (req, res) => {

  const jwt = require('jsonwebtoken');
  const { stock, timePeriod, info } = req.body;
  const token = req.cookies.token;
  const decoded = jwt.decode(token);
  const user_id = decoded.id;
  const query = 'INSERT INTO favorites (user_id, stock, time_period, info) VALUES (?, ?, ?, ?)';
  connection.query(query, [user_id, stock, timePeriod, info], (err, result) => {
    if (err) {
      console.error('Error adding stock to favorites:', err);
      res.status(500).json({ error: 'Failed to add stock to favorites' });
      return;
    }
    // Return a success response
    res.json({ success: true, message: 'Stock added to favorites' });
  });
});

router.get('/getFavorites/', (req, res) => {
  const jwt = require('jsonwebtoken');
  const token = req.cookies.token;
  const decoded = jwt.decode(token);
  const user_id = decoded.id;
  const query = 'SELECT * FROM favorites WHERE user_id = ' + user_id + ';';
  connection.query(query, (err, result) => {
    if (err) {
      console.error('Error retrieving favorites:', err);
      res.status(500).json({ error: 'Failed to retrieve favorites' });
      return;
    }

    res.json(result);
  });
});

module.exports = router;
