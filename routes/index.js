
//Import Management
const express = require('express');
const router = express.Router();
const {checkLoggedIn, justLogged} = require('./tokenVerification');

//Display the main page and the sentences
router.get('/jokes', checkLoggedIn, (req, res) => {
    //const token = res.header('authentificationToken');

    //const token = req.headers['authentificationToken']; 

    //Display the main frame of the application
    res.render('index', {userName: req.user.userName, 'jokes': {'joke': "haha"}});
});

module.exports = router;