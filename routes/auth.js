var express = require("express");
var route = express.Router();
var passport = require("passport");
var User = require("../models/user");
route.get("/home/register",function(req,res){
	res.render("register");
});
route.post("/home/register",function(req,res){
	var newUser = new User({
		username:req.body.username});
	User.register(newUser,req.body.password,function(err,user){
		if(err)
		{req.flash("error",err.message);
		 res.redirect("/home/register");}
		else
			passport.authenticate("local")(req,res,function(){
				req.flash("success","Welcome to Yelpcamp "+req.user.username);
				res.redirect("/home");
				})
			});
	});
route.get("/home/login",function(req,res){
	res.render("login");
});
route.post("/home/login",function(req,res,next){
	passport.authenticate("local",{
	successRedirect:"/home",
	failureRedirect:"/home/login",
	successFlash:"Welcome back "+req.body.username,
	failureFlash:"Invalid Credentials"
})(req,res);
});
route.get("/home/logout",function(req,res){
	req.logout();
	req.flash("success","Successfully logged out")
	res.redirect("/home");
})
function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
			return next();
	}
	req.flash("error","You need to login first");
	res.redirect("/home/login");
}
module.exports = route;