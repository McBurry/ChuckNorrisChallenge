const router = require('express').Router();
const mysql = require('mysql'); //To use mysql
const bodyParser = require('body-parser');
const fileReader = require('fs');
const html = require('html');

var urlencodedParser = bodyParser.urlencoded({ extended: false })

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
    fileReader.readFile('./public/registerPage.html', null, function (error, data) {
        if(error){
            res.writeHead(404);
            res.write("Impossible to find the asked file");
        }else{
            res.write(data);
        }

        res.end();
    });
});

//Register Page Management
router.get('/login', (req, res) => {
    fileReader.readFile('./public/loginPage.html', null, function (error, data) {
        if(error){
            res.writeHead(404);
            res.write("Impossible to find the asked file");
        }else{
            res.write(data);
        }

        res.end();
    });
});

//Register post management
router.post('/register', urlencodedParser, (req, res) => {

    //Check for already existing userName
    var sqlQuery = "SELECT * FROM User WHERE userName = ?";

    //Send the request to the database
    databaseObject.query(sqlQuery, [req.body.userName], function(error, result){
        if(error){
            console.log('An error occured when trying to add a user to the database');
            res.redirect('/api/user/register');
            return;
        }

        if(result.length == 0){
            var sqlQuery2 = "INSERT INTO User (userName, userPassword) VALUES ('" 
                    + req.body.userName + "', '" 
                    + req.body.userPassword + "')";

            //Make the SQL request to the server
            databaseObject.query(sqlQuery2, function (error, result) {
                if(error){
                    console.log('An error occured when trying to add a user to the database');
                    res.redirect('/api/user/register');
                }else{
                    console.log('The user ' + req.body.userName + ' has been insert in the database');
                    res.redirect('/api/listOfJokes');
                }
            });
        }else{
            res.redirect('/api/user/register');
        }
    });

});

//Log In post management
router.post('/login', urlencodedParser, (req, res) => {

    var sqlQuery = "SELECT * FROM User WHERE userName = ? AND userPassword = ?";
    databaseObject.query(sqlQuery, [req.body.userName, req.body.userPassword], function(error, result, fields){
        if(error){
            res.redirect('/api/user/login');
        }

        //If a match has been found
        if(result.length == 1){
            res.redirect('/api/listOfJokes');
        }else{
            res.redirect('/api/user/login');
        }
    });

});

module.exports = router;