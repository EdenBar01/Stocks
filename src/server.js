// Import required modules
const express = require('express');
const cookieParser = require('cookie-parser');
const { cookieJwtAuth } = require('./middleware/cookieJwtAuth');
const bodyParser = require('body-parser');
const db = require('./middleware/db');
const coolRoute = require('./routes/cooler');
const Path = require('path');
const authRouter = require('./routes/auth');

// Create an Express application
const app = express();

// user dependencies
app.use(express.static('public'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// set database
const connection = db();

app.use('/auth',authRouter);

// set routes
app.get('/', (req, res) => {
    res.sendFile(Path.join(__dirname, '../public/html/login.html'));
});



app.get('/cool_route', cookieJwtAuth,(req, res) => {
    res.sendFile(Path.join(__dirname, '../public/html/cool.html'));
});


app.post('/cool_route', cookieJwtAuth, coolRoute);

app.listen(8000, () => {
    console.log('Server is running on port 8000');
});