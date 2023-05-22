// api/index.js

const express = require('express');
const router = express.Router();

module.exports = (connection) => {
  // Pass the connection object to all API routes
  router.use('/users', require('./users/auth.js')(connection));
  return router;
};
