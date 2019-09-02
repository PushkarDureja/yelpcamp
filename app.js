var express = require("express");
var bodyparser = require("body-parser");
var mongoose = require("mongoose");
var app = express();
var method  = require("method-override");
var seedDB = require("./seed");
var Campground = require("./models/model");
var Comment = require("./models/comment");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var User = require("./models/user");
var commentRoute = require("./routes/comment");
var authRoute = require("./routes/auth");
var indexRoute = require("./routes/index");
var flash = require("connect-flash");
mongoose.connect(process.env.DATABASEURL,{useNewUrlParser:true});
// mongoose.connect("mongodb+srv://pushkar:wwweee@cluster0-clob0.mongodb.net/test?retryWrites=true&w=majority",{useNewUrlParser:true});
app.use(bodyparser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static('public'));
app.use(flash());
// Campground.create({
// 	name :"New Campground",
// 	image:"https://images.unsplash.com/photo-1497900304864-273dfb3aae33?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
// 	description:"asndoaksdjdml"
// });
// seedDB();
app.use(require("express-session")({
    secret: "Rusty is the best and cutest dog in the world",
    resave: false,
    saveUninitialized: false
}));
app.use(method("_method"));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next){
   res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
   next();
});
app.get("/",function(req,res){
	res.redirect("/home");
});
app.use(indexRoute);
app.use(commentRoute);
app.use(authRoute);
app.listen(process.env.PORT||8000,process.env.IP,function(){
	console.log("SERVER STARTED");
});
