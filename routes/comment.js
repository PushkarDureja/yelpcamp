var express = require("express");
var route = express.Router();
var Campground = require("../models/model");
var Comment = require("../models/comment");
route.get("/home/show/:id/comments/new",isLoggedIn,function(req,res){
	Campground.findById(req.params.id,function(err,found){
		if(err)
			console.log(err);
		else
			res.render("newComment",{found:found});
	});
});
route.post("/home/:id/comments",function(req,res){
	Campground.findById(req.params.id,function(err,camp){
		if(err)
			console.log(err)
		else{
			Comment.create(req.body.comment,function(err,Comment){
			if(err)
				console.log(err);
			else{
				Comment.author.id=req.user._id;
				Comment.author.username= req.user.username;
				Comment.save();
				camp.comments.push(Comment);
				camp.save();
				req.flash("success","Successfully added a comment");
				res.redirect("/home/show/" + camp._id);
				
			}
			});
		}	
	});
});
route.get("/home/comment/:cid/editComment",commentAuth,function(req,res){
	Comment.findById(req.params.cid,function(err,found){
		if(err)
			console.log(err)
		else
			res.render("editComment",{found:found});
	})
})
route.put("/home/comment/:cid",function(req,res){
	Comment.findByIdAndUpdate(req.params.cid,req.body.comment,function(err,updated){
		if(err)
			console.log(err)
		else
			req.flash("success","Comment Updated")
			res.redirect("/home");
	})
})
route.delete("/home/comment/:cid/deleteComment",commentAuth,function(req,res){
	Comment.findByIdAndRemove(req.params.cid,function(err,deleted){
		if(err)
			console.log(err);
		else
		{req.flash("success","Comment deleted");
			res.redirect("/home");}
	})
})
function commentAuth(req,res,next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.cid,function(err,found){
			if(found.author.id.equals(req.user._id))
				next();
			else
				res.redirect("back")
		})	
	}
	else
		res.redirect("back");
	
}
function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
			return next();
	}
	req.flash("error","You need to login first");
	res.redirect("/home/login");
	
}
module.exports = route;