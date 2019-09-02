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
mongoose.connect("mongodb://localhost/yelpCampground",{useNewUrlParser:true});
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
// app.get("/home",function(req,res){
// 	Campground.find({},function(err,display){
// 		if(err)
// 			console.log(err);
// 		else
// 		{res.render("camp",{display:display});
// 			}
// 	});
	
// });
// app.get("/home/new",isLoggedIn,function(req,res){
// 	res.render("new");
// });
// app.post("/home",function(req,res){
// 	Campground.create(req.body.Camp,function(err,display){
// 		if(err)
// 			console.log(err);
// 		else
// 			res.redirect("/home");
// 	});
// });
// app.get("/home/show/:id", function(req, res){
//     //find the Campground with provided ID
//     Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
//         if(err){
//             console.log(err);
//         } else {
            
//             //render show template with that Campgroundground
//              res.render("shows", {found: foundCampground});
//         }
//     });
// });
// app.get("/home/show/:id/comments/new",isLoggedIn,function(req,res){
// 	Campground.findById(req.params.id,function(err,found){
// 		if(err)
// 			console.log(err);
// 		else
// 			res.render("newComment",{found:found});
// 	});
// });
// app.post("/home/:id/comments",function(req,res){
// 	Campground.findById(req.params.id,function(err,camp){
// 		if(err)
// 			console.log(err)
// 		else{
// 			Comment.create(req.body.comment,function(err,Comment){
// 			if(err)
// 				console.log(err);
// 			else{
// 				camp.comments.push(Comment);
// 				camp.save();
// 				res.redirect("/home/show/" + camp._id);
				
// 			}
// 			});
// 		}	
// 	});
// });
// app.get("/home/register",function(req,res){
// 	res.render("register");
// });
// app.post("/home/register",function(req,res){
// 	var newUser = new User({
// 		username:req.body.username});
// 	User.register(newUser,req.body.password,function(err,user){
// 		if(err)
// 		{console.log(err);
// 		 res.redirect("/home/register");}
// 		else
// 			passport.authenticate("local")(req,res,function(){
// 				res.redirect("/home");
// 				})
// 			});
// 	});
// app.get("/home/login",function(req,res){
// 	res.render("login");
// });
// app.post("/home/login",passport.authenticate("local",{
// 	successRedirect:"/home",
// 	failureRedirect:"/home/login"
// }),function(req,res){
// });
// app.get("/home/logout",function(req,res){
// 	req.logout();
// 	res.redirect("/home");
// })
// function isLoggedIn(req,res,next){
// 	if(req.isAuthenticated()){
// 			return next();
// 	}
// 	res.redirect("/home/login");
// }
		
app.listen(4000,process.env.IP,function(){
	console.log("SERVER STARTED");
});
