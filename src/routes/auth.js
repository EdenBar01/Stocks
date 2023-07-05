const express = require('express');
const router = express.Router();
const Path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.get('/login', (req, res) => {
  res.sendFile(Path.join(__dirname, '../../public/html/login.html'));
});

router.get('/signup', (req, res) => {
  res.sendFile(Path.join(__dirname, '../../public/html/signUp.html'));
});

router.get('/contactus', (req, res) => {
  res.sendFile(Path.join(__dirname, '../../public/html/contactUs.html'));
});

// Wrap the login route handler in an async function
router.post('/login', async (req, res) => {
  // Access the data from req.body
  const { username, password } = req.body;
  const checkQuery = 'SELECT * FROM users WHERE username = ?';
  connection.query(checkQuery, [username], (error, results) => {
    if (error) {
      console.error('Error checking username:', error);
      return res.status(500).json({ success: false, error: 'Internal server error' });
    }
    if (results.length === 0) {
      return res.status(401).json({ success: false, error: 'Invalid username or password' });
    }
    const user = results[0];
    const passwordMatch = bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ success: faslse, error: 'Invalid username or password' });
    }
    const token = jwt.sign(user, "hello_world", { expiresIn: "1h" })
    res.cookie("token", token, { httpOnly: true });
    if (req.body.rememberMe) {
      res.cookie("username", username);
      res.cookie("password", username);
    }
    return res.json({ success: true, message: 'logged in successfuly', redirect: '/cool_route' });
  })
});

router.post('/register', async (req, res) => {
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
        return res.status(500).json({ success: false, error: 'Internal server error' });
      }

      if (results.length > 0) {
        return res.status(400).json({ success: false, error: 'Username already exists' });
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
              return res.status(500).json({ success: false, error: 'Internal server error' });
            }

            console.log('New user inserted');
            res.json({ success: true, message: 'User registered successfully' });
          });
        })
        .catch(hashError => {
          console.error('Error hashing password:', hashError);
          return res.status(500).json({ success: false, error: 'Internal server error' });
        });
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
