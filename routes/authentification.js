
const router = require('express').Router();
const mysql = require('mysql'); //To use mysql
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const passport = require('passport');

dotenv.config();

//Instanciate the connection object
var databaseObject = mysql.createPool({
    host: '89.234.180.47',
    user: 'wehhcj_chuckNor',
    password: 'chucknorris',
    database: 'wehhcj_chuckNor'
});

var listOfJokes;
requestSentences();

//Get the jokes from the API
async function requestSentences(){
    var request = require('request');
    request('http://api.icndb.com/jokes/random/10', function(error, response, body){
        if(!error && response.statusCode == 200){
            var info = JSON.parse(body);
            
            listOfJokes = info.value;
        }
    });
}

/**
 * Registration Management
 */

//Register Page Management
router.get('/register', (req, res) => {
    res.render('registerPage');
});

//Register Page Management
router.get('/login', (req, res) => {
    res.render('loginPage');
});

//Register post management
router.post('/register', (req, res) => {

    //Check for already existing userName
    var sqlQuery = "SELECT * FROM User WHERE userName = ?";

    //Send the request to the database
    databaseObject.query(sqlQuery, [req.body.userName], async function(error, result){
        if(error){
            console.log('An error occured when trying to add a user to the database');
            res.status(500).render('registerPage',{message: 'An error occured when trying to add a user to the database'});
            return;
        }

        //If there are no already existing username
        if(result.length == 0){

            //Password should be at least 6 caracters long and shorter than 32
            if(req.body.userPassword.length > 32){
                return res.status(400).render('registerPage', {message: 'The password cannot be longer than 32 caracters', userName: req.body.userName});
            }
            if(req.body.userPassword.length < 6){
                return res.status(400).render('registerPage', {message: 'The password should be at least 6 caracters long', userName: req.body.userName});
            }

            //Encrypting the password thanks to bcrypt
            const salt = await bcrypt.genSalt(10);
            const hashedUserPassword = await bcrypt.hash(req.body.userPassword, salt);

            var sqlQuery2 = "INSERT INTO User (userName, userPassword) VALUES ('" 
                    + req.body.userName + "', '" 
                    + hashedUserPassword + "')";

            //Make the SQL request to the server
            databaseObject.query(sqlQuery2, function (error, result) {
                if(error){
                    console.log('An error occured when trying to add a user to the database');
                    res.status(500).render('registerPage',{message: 'An error occured when trying to add a user to the database'});
                }else{
                    console.log('The user ' + req.body.userName + ' has been insert in the database');
                    req.flash('success_msg', 'You are now registered');
                    res.status(200).redirect('/user/login');//If everything was ok, go back to login page
                }
            });
        }else{

            return res.status(400).render('registerPage', {message: 'This User Name is already taken'});
        }
    });

});

//Log In post management
/*router.post('/login', (req, res) => {

    var sqlQuery = "SELECT * FROM User WHERE userName = ?";
    databaseObject.query(sqlQuery, [req.body.userName], async function(error, result, fields){
        if(error){
            res.status(500).render('loginPage',{message: 'An issue happened when trying to connect to the database'});
        }

        //If a match has been found
        if(result.length == 1){
            const correctPassword = await bcrypt.compare(req.body.userPassword, result[0].userPassword);

            //If the password isn't correct
            if(!correctPassword) res.status(400).render('loginPage',{message: 'The password isn\'t correct', userName: req.body.userName});

            //Create and given a jwt
            const token = jwt.sign({idUser: result.idUser}, process.env.PRIVATE_TOKEN);

            //res.render('index', {userName: 'testPerson', jokes: listOfJokes});
            //res.end();
            res.header('token', token);
            
            res.redirect(200, '/');
            //res.header('authentificationToken', token).status(200).redirect('/api/listOfJokes');
        }else{
            res.status(404).render('loginPage', {message: 'Couldn\'t find the requested User Name'});
        }
    });

});*/

//Redirection management for the login page
router.post('/login', (req, res, next) => {
    console.log("body parsing", req.body);
    passport.authenticate('local', {
        successRedirect: '/jokes', //When the logging in worked
        failureRedirect: '/user/login', //When an error occured
        failureFlash: true
    })(req, res, next);
});

//Manages the logging out of the user
router.get('/logout', (req, res) => {
    req.logOut();
    req.flash('success_msg', 'You have been logged out');
    res.redirect('/user/login');
});

module.exports = router;