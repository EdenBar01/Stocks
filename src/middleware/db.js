const mysql = require('mysql2')

// Database connection settings
module.exports = () =>{
  const mysqlConfig = {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_ROOT_PASSWORD,
    database: process.env.MYSQL_DATABASE
  }

  let con = null;

  // Connect to the database
  connection =  mysql.createConnection(mysqlConfig);
  connection.connect(function(err) {
      if (err) throw err;
      
    });

// Create the user table
const createUserTableQuery = `
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL
)
`;

const createFavoriteTableQuery = `
CREATE TABLE IF NOT EXISTS favorites (
  user_id INT NOT NULL,
  stock VARCHAR(255) NOT NULL,
  time_period VARCHAR(255) NOT NULL,
  info VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id, user_id, stock, time_period, info),
  FOREIGN KEY (user_id) REFERENCES users(id)
)
`;


  connection.query(createUserTableQuery, (errpr) => {
    if (errpr) throw errpr;
    else {
      console.log('User table created');
    }
  })

  connection.query(createFavoriteTableQuery, (errpr) => {
    if (errpr) throw errpr;
    else {
      console.log('User table created');
    }
  })
  
  module.exports.connection = connection; // Export the connection constant separately
};


