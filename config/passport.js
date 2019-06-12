
const LocalStrategy = require('passport-local').Strategy;
const mysql = require('mysql');
const bcrypt = require('bcryptjs');

const authentification = require('../routes/authentification');

//Instanciate the connection object
var databaseObject = mysql.createPool({
    host: '89.234.180.47',
    user: 'wehhcj_chuckNor',
    password: 'chucknorris',
    database: 'wehhcj_chuckNor'
});

//Handles the passport module connection
module.exports = function(passport){
    passport.use(
        new LocalStrategy( function(username, password, done) {
            var sqlQuery = "SELECT * FROM User WHERE userName = '" + username + "'";

            //Make the SQL request to the server
            databaseObject.query(sqlQuery, async function (error, result) {
                
                if(result.length == 0){
                    return done(null, false, {message: 'This User Name isn\'t in the database'});
                }

                //Check the password that was encrypted in the database
                const correctPassword = await bcrypt.compare(password, result[0].userPassword);

                if(!correctPassword) return done(null, false, {message: 'The given password isn\'t correct'});

                //Store the user details in the passport
                var user = {
                    'idUser': result[0].idUser,
                    'userName': result[0].userName,
                    'userPassword': result[0].userPassword,
                };

                return done(null, user);
            });
        })
    );

    passport.serializeUser(function(user, done){
        done(null, user.idUser);
    });

    passport.deserializeUser(function(idUser, done){
        var sqlQuery = "SELECT * FROM User WHERE idUser = '" + idUser + "'";

        //Make the SQL request to the server
        databaseObject.query(sqlQuery, function (error, result) {
            var user = result[0];
            done(error, user);
        });
    });
};