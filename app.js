
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
const path = require('path');

require('./config/passport')(passport);

//Managing of the ejs files
application.use(expressLayouts);
application.set('view engine', 'ejs');

//Parsing of the body
//application.use(express.urlencoded({ extended: false }));
application.use(bodyParser.urlencoded({ extended: true }));
application.use(bodyParser.json());

application.use(express.static(path.join(__dirname, 'public')));

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

application.listen(3000, () => console.log('Serveur ready and listening'));