
const router = require('express').Router();
const mysql = require('mysql'); //To use mysql
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const passport = require('passport');
const {checkLoggedIn, justLogged} = require('./tokenVerification');

dotenv.config();

//Instanciate the connection object
var databaseObject = mysql.createPool({
    host: '89.234.180.47',
    user: 'wehhcj_chuckNor',
    password: 'chucknorris',
    database: 'wehhcj_chuckNor'
});

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
    var sqlQuery = "SELECT * FROM User WHERE username = '" + req.body.username + "'";

    //Send the request to the database
    databaseObject.query(sqlQuery, async function(error, result, fields){
        if(error){
            console.log('An error occured when trying to add a user to the database');
            req.flash('error', 'An error occured when trying to access the database');
            return res.redirect(500, 'registerPage');
        }

        //If there are no already existing username
        if(result.length == 0){

            //Password should be at least 6 caracters long and shorter than 32
            if(req.body.password.length > 32){
                req.flash('error', 'The password cannot be longer than 32 caracters');
                return res.status(400).redirect('/user/register');
            }
            if(req.body.password.length < 6){
                req.flash('error', 'The password should be at least 6 caracters long');
                return res.status(400).redirect('/user/register');
            }
            
            var verif = false;
            var nbTimeFound = 0;

            var passWordStringCheck = req.body.password;

            //Go through all of the letters of the alphabet in lower and upper case
            //By incrementing numbers and then transforming them in letter via ASCII table
            //If it finds followings of i, i+1 and i+2, returns true
            for(var i = 65; i < 121; i++){
                var temp = String.fromCharCode(i, i+1, i+2);
        
                //If there is a match
                if(passWordStringCheck.search(temp)!=-1){
                    verif = true;
                }
                if(i==88) i = 96
            }

            //Display error and redirect
            if(!verif){
                req.flash('error', 'Passwords must include one increasing straight of at least three letters, like ‘abc’, ‘cde’, ‘fgh’, and so on, up to ‘xyz’.');
                return res.status(400).redirect('/user/register');
            }

            var regex = /[iOl]/;
            //Check is there are any of the i, O or l letters
            if(regex.test(passWordStringCheck)){
                req.flash('error', 'asswords may not contain the letters i, O, or l, as these letters can be mistaken for other characters and are therefore confusing.');
                return res.status(400).redirect('/user/register');
            }

            verif = false;

            //Go through all of the letters of the alphabet in lower and upper case
            //By incrementing numbers and then transforming them in letter via ASCII table
            //If it finds two pairs of the same letter return true
            for(var i = 65; i < 123; i++){
                var temp = String.fromCharCode(i, i);
        
                //If there is a match
                if(passWordStringCheck.search(temp)!=-1){
                    passWordStringCheck = passWordStringCheck.replace(temp, '');
                    nbTimeFound++;
                    verif = true;
                }
                if(i==90) i = 96
            }

            //Verif if there was a match
            if(verif){
                verif = false;

                //Do again the search
                for(var i = 65; i < 123; i++){
                    var temp = String.fromCharCode(i, i);
            
                    //If there is a match
                    if(passWordStringCheck.search(temp)!=-1){
                        verif = true;
                        nbTimeFound
                    }
                    if(i==90) i = 96
                }

                //If at least two of them have been found, validate the password
                if(nbTimeFound >= 2){
                    console.log('The password has been accepted !');
                }else{
                    req.flash('error', 'The password should have at least two non-overlapping pairs of letters, like aa, bb, or cc.');
                    return res.status(400).redirect('/user/register');
                }

            }else{
                req.flash('error', 'The password should have at least two non-overlapping pairs of letters, like aa, bb, or cc.');
                return res.status(400).redirect('/user/register');
            }
                    

            //Encrypting the password thanks to bcrypt
            const salt = await bcrypt.genSalt(10);
            const hashedUserPassword = await bcrypt.hash(req.body.password, salt);

            var sqlQuery2 = "INSERT INTO User (userName, userPassword) VALUES ('" 
                    + req.body.username + "', '" 
                    + hashedUserPassword + "')";

            //Make the SQL request to the server
            databaseObject.query(sqlQuery2, function (error, result, fields) {
                if(error){
                    console.log('An error occured when trying to add a user to the database');
                    //res.status(500).render('registerPage',{message: 'An error occured when trying to add a user to the database'});
                    req.flash('error', 'An error occured when trying to add a user to the database');
                    res.status(400).redirect('/user/login');
                }else{
                    console.log('The user ' + req.body.username + ' has been insert in the database');
                    req.flash('success_msg', 'You are now registered');
                    res.status(200).redirect('/user/login');//If everything was ok, go back to login page
                }
            });
        }else{

            return res.status(400).render('registerPage', {message: 'This User Name is already taken'});
        }
    });

});

//Redirection management for the login page
router.post('/login', (req, res, next) => {
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

//Manages the adding of favorites in the database
router.post('/addFavorite', checkLoggedIn, (req, res) => {

    var sqlQuery = "SELECT * FROM Favorites WHERE idUser = " + req.user.idUser;

    //Make the SQL request to the server
    databaseObject.query(sqlQuery, function (error, result) {
        if(error){
            console.log('An error occured when trying to get the favorites from the database');
            res.render('loginPage',{message: 'An error occured when trying to get the favorites from the database'});
        }

        var nbOfJokes = result.length;

        //If there are already 10 favorites, cancel it
        if(result.length >= 10){
            console.log('You cannot have more than 10 favorites');
            return res.json({message: 'You cannot have more than 10 favorites',
                                alert: 'You cannot have more than 10 favorites',
                                nbOfFavorites: nbOfJokes});
        }else{
            var sqlQuery2 = "INSERT INTO Favorites (idUser, idJoke, favoriteJoke) VALUES ('" 
                    + req.user.idUser + "', '" 
                    + req.body.idJoke + "', '" 
                    + req.body.joke.replace('\'', '\\\'') + "')";

            //Make the SQL request to the server
            databaseObject.query(sqlQuery2, function (error, result2) {
                if(error){
                    console.log('An error occured when trying to add a favorite to the database');
                    return res.redirect(500, '/jokes',{message: 'An error occured when trying to add a favorite to the database'});
                }else{
                    console.log('The joke ' + req.user.idJoke + ' has been insert in the database');
                    
                    //Send back the result to the AJAX request
                    req.flash('success_msg', 'Joke added');
                    return res.json({message: 'worked',
                                nbOfFavorites: nbOfJokes,
                                success: 'The joke have been added to favorites',
                                joke: req.body.joke,
                                idJoke: req.body.idJoke});
                }
            });
        }
        
    });

});

//Manages the suppression of favorites in the dabatase
router.post('/removeFavorite', checkLoggedIn, (req, res) => {

    var sqlQuery = "SELECT * FROM Favorites WHERE idUser = " + req.user.idUser;

    //Make the SQL request to the server
    databaseObject.query(sqlQuery, function (error, result) {
        if(error){
            console.log('An error occured when trying to get the favorites from the database');
            return res.render('loginPage',{message: 'An error occured when trying to get the favorites from the database'});
        }

        var nbOfJokes = result.length;

        if(nbOfJokes >= 1){
            var sqlQuery2 = "DELETE FROM Favorites WHERE idJoke = " 
                        + req.body.idJoke;

            //Make the SQL request to the server
            databaseObject.query(sqlQuery2, function (error, result) {
                if(error){
                    console.log('An error occured when trying to remove the favorite from the database');
                    return res.redirect(400, '/jokes',{message: 'An error occured when trying to delete the favorite from the database'});
                }else{
                    console.log('The joke ' + req.body.idJoke + ' has been removed from the database');
                    
                    //Send back the result to the AJAX request
                    return res.json({message: 'worked',
                                nbOfFavorites: nbOfJokes,
                                success: 'The joke have been deleted from the favorites',
                                idJoke: req.body.idJoke});
                }
            });
        }

    });
});

//Manages the random adding of jokes in the database
router.get('/addRandomJoke', checkLoggedIn, (req, res) => {
    var sqlQuery = "SELECT * FROM Favorites WHERE idUser = " + req.user.idUser;

     //Make the SQL request to the server
     databaseObject.query(sqlQuery, async function (error, result) {
        if(error){
            console.log('An error occured when trying to get the favorites from the database');
            return res.status(500).render('loginPage',{message: 'An error occured when trying to get the favorites from the database'});
        }

        var nbOfJokes = result.length;

        //If there are already 10 favorites, cancel it
        if(result.length >= 10){
            console.log('You cannot have more than 10 favorites');
            return res.json({message: 'You cannot have more than 10 favorites',
                                alert: 'You cannot have more than 10 favorites',
                                nbOfFavorites: nbOfJokes});
        }else{
            var randomJoke = await requestRandomSentence();

            var sqlQuery2 = "INSERT INTO Favorites (idUser, idJoke, favoriteJoke) VALUES ('" 
                    + req.user.idUser + "', '" 
                    + randomJoke[0].id + "', '" 
                    + randomJoke[0].joke.replace('\'', '\\\'') + "')";

            //Make the SQL request to the server
            databaseObject.query(sqlQuery2, function (error, result2) {
                if(error){
                    console.log('An error occured when trying to add a favorite to the database');
                    res.status(500).redirect('/jokes',{message: 'An error occured when trying to add a favorite to the database'});
                }else{
                    console.log('The joke ' + req.user.idJoke + ' has been insert in the database');
                    
                    //Send back the result to the AJAX request
                    return res.json({message: 'worked',
                                nbOfFavorites: nbOfJokes,
                                success: 'The joke have been added to favorites',
                                joke: randomJoke[0].joke,
                                idJoke: randomJoke[0].id});
                }
            });

        }
        
    });

});

//Get one random joke from the API
async function requestRandomSentence(){

    var request = require('request');
    return new Promise ( function(resolve, reject) {
        request('http://api.icndb.com/jokes/random/1', function(error, response, body){
            if(!error && response.statusCode == 200){
                var info = JSON.parse(body);
                
                resolve(info.value);
            }
        });
    } )

}

module.exports = router;