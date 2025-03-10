//Dependecies
const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const authController = require('./controllers/auth');
const session = require('express-session');

//Initialize Express
const app = express();

//Configure Settings
dotenv.config();
const port = process.env.PORT || '3000';

//Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected', () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

//Mount Middleware
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(morgan('dev'));

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
    })
);

//fun fact! Router code is actually a type of middleware!
//any http request from the browser come to /auth....
//will automatically be forwarded to the router code
//inside the authController
app.use('/auth', authController);

//Mount Routes

app.get('/', (req, res) => {
    res.render('index.ejs', {
        user: req.session.user,
    });
})


//Tell App to Listen for HTTP requests
app.listen(port, () => {
    console.log(`The express app is ready on the port ${port}!`);
});