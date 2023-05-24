
// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
// Create an Express application
const app = express();
app.use(express.static('public'));


// Import the database connection function
const db = require('./db');

// set mysql connection
const connection = db();

//set port
var port = process.env.PORT || 8000;

// Set up middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



 // Read all files in the 'api' folder
fs.readdirSync('./api').forEach(file => {
   // Exclude non-JavaScript files and index.js
  if (file.endsWith('.js') && file !== 'index.js') {
    const route = require(`./api/${file}`);
    app.use('/', route);
  }
});

app.get('/', (req, res) => {
  res.sendFile('public/login.html', { root: __dirname });
});


// Start the server
app.listen(8000, () => {
  console.log('Server is running on port 8000');
});
