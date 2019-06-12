
//Import Management
const express = require('express');
const application = express();
const expressLayouts = require('express-ejs-layouts');
const mysql = require('mysql'); //To use mysql
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

require('./config/passport')(passport);

//Managing of the ejs files
application.use(expressLayouts);
application.set('view engine', 'ejs');

//Parsing of the body
//application.use(express.urlencoded({ extended: false }));
application.use(bodyParser.urlencoded({ extended: true }));

application.use(bodyParser.json());

//Managing of the sessions
application.use(session({
    secret: '<mysecret>',
    resave: true,
    saveUninitialized: true
}));

//Manages passport implementation
application.use(passport.initialize());
application.use(passport.session());

//Managing of flash
application.use(flash());

application.use((req, res, next) =>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error = req.flash('error');
    next();
});

//To manage user authentification
application.use('/', require('./routes/index.js'));
application.use('/user', require('./routes/authentification.js'));

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