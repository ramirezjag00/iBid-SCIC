//all the middleware goes here
var Item = require("../models/item");
var Comment = require("../models/comment");
var middlewareObj = {};

middlewareObj.checkItemOwnership = function(req,res,next) {
		if(req.isAuthenticated()){
			Item.findById(req.params.id, function(err, foundItem){
				if(err){
				res.redirect("back");
				} else {
					//does user own the item?
				if(foundItem.author.id.equals(req.user._id)){
					next();
				} else {
					res.redirect("back");
				}
				}
			});
	} else {
		res.redirect("back");
	}
} 

middlewareObj.checkCommentOwnership = function(req,res,next) {
		if(req.isAuthenticated()){
			Comment.findById(req.params.comment_id, function(err, foundComment){
				if(err){
				res.redirect("back");
				} else {
					//does user own the comment?
				if(foundComment.author.id.equals(req.user._id)){
					next();
				} else {
					res.redirect("back");
				}
				}
			});
	} else {
		res.redirect("back");
	}
} 

middlewareObj.isLoggedIn = function(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

module.exports = middlewareObj;
