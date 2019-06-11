
//Import Management
const express = require('express');
const application = express();
const fileReader = require('fs');
const mysql = require('mysql'); //To use mysql
const authentificationRoute = require('./routes/authentification');

//To manage user authentification
application.use('/api/user', authentificationRoute);

//To use JSON format
application.use(express.json());

//Instanciate the connection object
var databaseObject = mysql.createPool({
    host: '89.234.180.47',
    user: 'wehhcj_chuckNor',
    password: 'chucknorris',
    database: 'wehhcj_chuckNor'
});

//To manage the list of jokes
var listOfJokes;
requestSentences();

application.get('/api/listOfJokes', (req, res) => {
    fileReader.readFile('./public/index.html', null, function (error, data){
        if(error){
            res.writeHead(404);
            res.write("Couldn't find the requested page :/");
        }else{
            res.write(data);
        }
    });
});


//Display all of the sentences
application.get('/api/getSentences', (req, res) => {
    requestSentences();
    
    var sentences = [];
    for(var i = 0; i < listOfJokes.length; i++){
        sentences.push(listOfJokes[i].joke);
    }

    res.json(listOfJokes);
});

//Get the information about the user
application.get('/api/getUserInfo', (req, res) => {

    var sqlQuery = "SELECT * FROM User";
    databaseObject.query(sqlQuery, function(error, result, field){
        if(error){
            console.log(error);
        }

        res.send(result[0]);
    });

});


async function requestSentences(){
    var request = require('request');
    request('http://api.icndb.com/jokes/random/10', function(error, response, body){
        if(!error && response.statusCode == 200){
            var info = JSON.parse(body);
            
            listOfJokes = info.value;
        }
    });
}

application.listen(3000, () => console.log('Serveur ready and listening'));