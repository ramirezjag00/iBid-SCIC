var express = require("express");
var router = express.Router({mergeParams:true});
var Item = require("../models/item");
var User = require("../models/user");
var Bid = require("../models/bid");
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

//BID CREATE ROUTE

router.put("/", middleware.isLoggedIn, function(req,res){
	//lookup item using ID
	Item.findByIdAndUpdate(req.params.id, function(err, item){
		if(err){
			console.log(err);
			res.redirect("/items");
		} else {
			//create new bid
			Bid.create(req.params.id, function(err, bid){
				if(err){
					console.log(err);
				} else {
					//add name and bidder to item
					bid.author.id = req.user._id;
					item.highestBidder = req.user.name;
					bid.item_id = req.item._id;
					item.price = req.body.price;
					//save bid
					// bid.save();
					item.bids+=bid;
					// item.save();
					res.redirect("/items/"+item._id, {item:item.highestBidder});
				}
			});
		}
	});
});

module.exports = router;