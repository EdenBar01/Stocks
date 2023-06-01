const bcrypt = require('bcryptjs');

module.exports = (req, res, connection) => {
    // Access the data from req.body
    try {
        const { username, password } = req.body;
        console.log('username:', username);
        console.log('password:', password);
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
  };