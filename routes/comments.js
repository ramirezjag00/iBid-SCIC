var express = require("express");
var router = express.Router({mergeParams:true});
var Item = require("../models/item");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//comments new
router.get("/", middleware.isLoggedIn, function(req, res){
		//find item by id
		Item.findById(req.params.id, function(err,item){
			if(err){
				console.log(err);
			} else {
				res.render("/items/"+item._id, {item: item});
			}
		});
});

//comments create
router.post("/", middleware.isLoggedIn, function(req,res){
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
					comment.author.name = req.user.name;
					comment.author.lname = req.user.lname;
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
//////////////////////////////
//comments edit route
router.get("/edit", middleware.checkCommentOwnership, function(req,res){
	Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err){
			res.redirect("back");
		} else {
			res.render("comments/edit", { item_id: req.params.id, comment: foundComment});
		}
	});
});

//comment update route
router.put("/", middleware.checkCommentOwnership, function(req,res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if (err){
			res.redirect("back");
		} else {
			res.redirect("/items/"+ req.params.id);
		}
	});
});

//comment destroy route
router.delete("/", middleware.checkCommentOwnership, function(req,res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			res.redirect("back");
		} else {
			res.redirect("/items/"+req.params.id);
		}
	});
});
//////////////////////////////
module.exports = router;