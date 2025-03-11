//Dependecies
const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const authController = require('./controllers/auth');
const fruitsController = require("./controllers/fruits")
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

app.use((req, res, next) => {
    if (req.session.message) {
        //res.locals makes information available to templates
        //res is the response object
        //the response object is part of our communication with the client
        res.locals.message = req.session.message;
        //now we can clear out or nullify req.session.message
        req.session.message = null;
    }
    //now we can pass along the request to our routes
    next(); //next calls the next middleware function or route handler
    //NOTE: route handlers are a type of middleware
});

//fun fact! Router code is actually a type of middleware!
//any http request from the browser come to /auth....
//will automatically be forwarded to the router code
//inside the authController
app.use('/auth', authController);
app.use('/fruits', fruitsController);



//Mount Routes

app.get('/', (req, res) => {
    res.status(200).render('index.ejs', {
        user: req.session.user,
    });
});

//Protected Route - user must be logged in for access
app.get('/vip-lounge', (req, res) => {
    if (req.session.user) {
        res.send('Welcome to the VIP Lounge');
    } else {
        res.send('Sorry, you must be logged in for that.')
    }
});

//The Catch All route should always be listed last
//page sent for 404 ERRORS
app.get('*', (req, res) => {
    res.status(404).render('error.ejs', {msg: 'Page not found!'});
});

//Custom Error Function
const handleServerError = (err) => {
    if (err.code === 'EADDRINUSE') {
        console.log(`Warning! Port ${port} is already taken!`);
    } else {
        console.log('Error:', err);
    }
};


//Tell App to Listen for HTTP requests
app.listen(port, () => {
    console.log(`The express app is ready on the port ${port}!`);
}).on('error', handleServerError);