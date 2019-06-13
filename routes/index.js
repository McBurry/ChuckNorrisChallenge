
//Import Management
const express = require('express');
const router = express.Router();
const mysql = require('mysql'); //To use mysql
const {checkLoggedIn, justLogged} = require('./tokenVerification');

//Instanciate the connection object
var databaseObject = mysql.createPool({
    host: '89.234.180.47',
    user: 'wehhcj_chuckNor',
    password: 'chucknorris',
    database: 'wehhcj_chuckNor'
});

var jokes = [];
requestSentences();

//Get the jokes from the API
async function requestSentences(){
    var request = require('request');
    request('http://api.icndb.com/jokes/random/10', function(error, response, body){
        if(!error && response.statusCode == 200){
            var info = JSON.parse(body);
            
            jokes = info.value;
        }
    });
}

//Display the main page and the sentences
router.get('/jokes', checkLoggedIn, (req, res) => {
    //const token = res.header('authentificationToken');

    //const token = req.headers['authentificationToken']; 

    var sqlQuery2 = "SELECT * FROM Favorites WHERE idUser = " + req.user.idUser;

    //Make the SQL request to the server
    databaseObject.query(sqlQuery2, function (error, result) {
        if(error){
            console.log('An error occured when trying to get the favorites from the database');
            res.status(500).render('loginPage',{message: 'An error occured when trying to get the favorites from the database'});
        }
        //req.flash('success_msg', 'You are now registered');
        //res.status(200).redirect('/jokes');//If everything was ok, go back to login page

        res.render('index', {userName: req.user.userName, favoriteJokes: result, jokes: jokes});
    });

    //Display the main frame of the application
    //console.log(jokes);
    
});

module.exports = router;