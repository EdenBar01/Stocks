const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();

  // register route handler
  router.post('/api/register', async (req, res) => {
      try {
          const { username, password } = req.body;

          // Check if the username is already taken
          const checkQuery = 'SELECT * FROM users WHERE username = ?';
          connection.query(checkQuery, [username], (error, results) => {
              if (error) {
              console.error('Error checking username:', error);
              return res.status(500).json({success: false, error: 'Internal server error' });
              }
      
              if (results.length > 0) {
              return res.status(400).json({success: false, error: 'Username already exists' });
              }
      
              // Hash the password
              bcrypt.hash(password, 10)
              .then(hashedPassword => {
                // Create a new user
                const newUser = {
                  username,
                  password: hashedPassword
                };
            
                // Insert the new user into the database
                const insertQuery = 'INSERT INTO users (username, password) VALUES (?, ?)';
                connection.query(insertQuery, [newUser.username, newUser.password], (insertError, result) => {
                  if (insertError) {
                    console.error('Error inserting new user:', insertError);
                    return res.status(500).json({success: false, error: 'Internal server error' });
                  }
            
                  console.log('New user inserted');
                  res.json({success: true, message: 'User registered successfully' });
                });
              })
              .catch(hashError => {
                console.error('Error hashing password:', hashError);
                return res.status(500).json({success: false, error: 'Internal server error' });
              });
          });
          } catch (error) {
          res.status(500).json({ error: 'Internal server error' });
          }
    });


    
  // login route handler
  router.post('/api/login', async (req, res) => {
      try {
          const { username, password } = req.body;
      
          // Query the database for the user
          const selectQuery = 'SELECT * FROM users WHERE username = ?';
          connection.query(selectQuery, [username], async (error, results) => {
            if (error) {
              console.error('Error querying the database:', error);
              return res.status(500).json({success: false, error: 'Internal server error' });
            }
      
            // Check if the user exists
            if (results.length === 0) {
              return res.status(401).json({success: false, error: 'Invalid username or password' });
            }
      
            const user = results[0];
            console.log(user);
            // Compare the provided password with the hashed password from the database
            const passwordMatch = await bcrypt.compare(password, user.password);
      
            // Check if the passwords match
            if (!passwordMatch) {
              return res.status(401).json({success: false, error: 'Invalid username or password' });
            }
      
            // Passwords match, user is authenticated
            res.json({success: true, message: 'Login successful', user: user});
          });
        } catch (error) {
          res.status(500).json({success: false, error: 'Internal server error' });
        }    
    });
    
module.exports = router;
