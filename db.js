const mysql = require('mysql2')

// Database connection settings

const mysqlConfig = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_ROOT_PASSWORD,
  database: process.env.MYSQL_DATABASE
}

let con = null

// Connect to the database
connection =  mysql.createConnection(mysqlConfig);
connection.connect(function(err) {
    if (err) throw err;
    
  });

module.exports = (connection) => {
    // Return the connection object
    return connection;
};