//this file includes the root route, auth route and isLoggedIn function
var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

//ROOT ROUTE
router.get("/", function(req,res){
	res.redirect("/items");
});

//register form route
router.get("/register", function(req,res){
	res.render("register");
});

//handle sign up logic
router.post("/register", function(req,res){
	var newUser = new User({name:req.body.name, lname:req.body.lname, username:req.body.username});
	User.register(newUser, req.body.password, function(err,user){
		if(err){
			req.flash("error", err.message);
			return res.render("register");
		}
		passport.authenticate("local")(req,res,function(){
			req.flash("success", "Welcome to iBid "+user.username);
			res.redirect("/items");
		});
	});
});

//log in route
router.get("/login", function(req,res){
	res.render("login");
});

//handling log in logic
router.post("/login",passport.authenticate("local", 
	{
	successRedirect:"/items", 
	failureRedirect: "/login",
	failureFlash: true
	}), function(req, res){
});
	

//log out route
router.get("/logout", function(req,res){
	req.logout();
	req.flash("success", "Successfully logged out!");
	res.redirect("/login");
});

module.exports = router;