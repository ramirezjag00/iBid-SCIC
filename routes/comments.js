var express = require("express");
var router = express.Router({mergeParams:true});
var Item = require("../models/item");
var Comment = require("../models/comment");

//comments new
router.get("/new", isLoggedIn, function(req, res){
		//find item by id
		Item.findById(req.params.id, function(err,item){
			if(err){
				console.log(err);
			} else {
				res.render("comments/new", {item: item});
			}
		});
});

//comments create
router.post("/", isLoggedIn, function(req,res){
	//lookup item using ID
	Item.findById(req.params.id, function(err, item){
		if(err){
			console.log(err);
			res.redirect("/items");
		} else {
			//create new comment
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					console.log(err);
				} else {
					//add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					//save comment
					comment.save();
					item.comments.push(comment);
					item.save();
					res.redirect("/items/"+item._id);
				}
			});
		}
	});
});

//middleware
function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

module.exports = router;