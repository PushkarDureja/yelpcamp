var express = require("express");
var route = express.Router();
var Campground = require("../models/model");


route.get("/home",function(req,res){
	Campground.find({},function(err,display){
		if(err)
			console.log(err);
		else
		{res.render("camp",{display:display});
			}
	});
	
});
route.get("/home/new",isLoggedIn,function(req,res){
	res.render("new");
});
route.post("/home",function(req,res){
	Campground.create(req.body.Camp,function(err,display){
		if(err)
			console.log(err);
		else
			display.author.id = req.user._id
			display.author.username = req.user.username;
			display.save();
			res.redirect("/home");
	});
});
route.get("/home/show/:id", function(req, res){
    //find the Campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            //render show template with that Campgroundground
             res.render("shows", {found: foundCampground});
        }
    });
});
route.get("/home/show/:id/edit",authorized,function(req,res){
	Campground.findById(req.params.id,function(err,found){
		if(err)
			console.log(err);
		else
		res.render("edit",{found:found});
	})
});
route.put("/home/:id",function(req,res){
	Campground.findByIdAndUpdate(req.params.id,req.body.Camp,function(err,updted){
		if(err)
			console.log(err);
		else
			req.flash("success","Campground Updated")
			res.redirect("/home/show/"+req.params.id);
	})
})
route.delete("/home/:id",authorized,function(req,res){
	Campground.findByIdAndRemove(req.params.id,function(err,found){
		if(err)
			console.log(err)
		else
			req.flash("success","Campground Deleted")
			res.redirect("/home")
	})
})
function authorized(req,res,next){
	if(req.isAuthenticated()){
		Campground.findById(req.params.id,function(err,found){
			if(err)
				console.log(err);
			else
				{
					if(found.author.id.equals(req.user._id))
						next();
					else
					{req.flash("error","something went wrong");
						res.redirect("back");}
				}
				
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