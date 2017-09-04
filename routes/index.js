var express = require('express');
var router = express.Router();

var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/');
}

module.exports = function(passport){

	/* GET login page. */
	router.get('/', function(req, res) {
    	// Display the Login page with any flash message, if any
		res.render('index', {title: 'Login', message: req.flash('message') });
	});


	/* GET Home Page */
	router.get('/home', isAuthenticated, function(req, res){
		res.render('home', {title:'Home', user: req.user });
	});

	/* Handle Logout */
	router.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	// route for facebook authentication and login
	// different scopes while logging in
	router.get('/login/facebook',
		passport.authenticate('facebook', { scope : ['email'] }
	));

	// handle the callback after facebook has authenticated the user
	router.get('/login/facebook/callback',
		passport.authenticate('facebook', {
			scope : ['email'],
			successRedirect : '/home',
			failureRedirect : '/'
		})
	);

	router.get('/login/google',
	  passport.authenticate('google', {scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
    ]}),
		function(req, res){
	    // The request will be redirected to Google for authentication, so
	    // this function will not be called.
	  });

	router.get('/login/google/callback',
	  passport.authenticate('google', { failureRedirect: '/' }),
	  function(req, res) {
	    // Successful authentication, redirect home.
	    res.redirect('/home');
	  });
	return router;
}
