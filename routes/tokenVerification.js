
const jwt = require('jsonwebtoken');

module.exports = {

    //Check if the person is logged in
    checkLoggedIn: function(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash('error', 'You need to login');
        res.redirect('/user/login');
    },
    justLogged: function(req, res, next){
        if(!req.isAuthenticated()){
            return next();
        }
        res.redirect('/jokes');
    }
};