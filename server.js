//Dependecies
const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');


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


//Mount Routes




//Tell App to Listen for HTTP requests
app.listen(port, () => {
    console.log(`The express app is ready on the port ${port}!`);
});