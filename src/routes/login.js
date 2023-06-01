const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

module.exports = (req, res, connection) => {
  // Access the data from req.body
  const { username, password } = req.body;
  const checkQuery = 'SELECT * FROM users WHERE username = ?';
  connection.query(checkQuery, [username], (error, results) => {
  if (error) {
    console.error('Error checking username:', error);
  return res.status(500).json({success: false, error: 'Internal server error' });
  }
  if (results.length === 0) {
    return res.status(401).json({success: false, error: 'Invalid username or password' });
  }
  const user = results[0];
  const passwordMatch = bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(401).json({success: faslse, error: 'Invalid username or password' });
  }
  const token = jwt.sign(user, "hello_world", {expiresIn: "1h"})
  res.cookie("token", token, {httpOnly: true});
  return res.redirect('/cool_route');
  })
};
