const express = require('express');
const router = express.Router();

//NOTE: there are no routes her yet...need to define first route

//Routes

//The router object is similar to the app object in server js
//however it only has router functionality
router.get('/sign-up', (req, res) => {
    res.render('auth/sign-up.ejs');
});


module.exports = router;