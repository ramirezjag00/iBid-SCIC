var express = require("express");
var router = express.Router();
var Item = require("../models/item");
var middleware = require("../middleware");

//INDEX ROUTE
router.get("/", function(req,res){
	//get all items from DB
	Item.find({}, function(err, allItems){
		if(err){
			console.log(err);
		} else {
			res.render("items/index", {items: allItems});
		}
	});
});

//CREATE ROUTE
router.post("/", middleware.isLoggedIn, function(req,res){
	var name = req.body.name;
	var price = req.body.price;
	var bidPrice = req.body.bidPrice;
	var highestBidder = "";
	var endDate = req.body.endDate;
	var image = req.body.image;
	var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username,
		name: req.user.name
	}
	var newItem = {name: name, price:price, bidPrice:bidPrice, highestBidder : highestBidder, image: image, description:desc, author:author}
	//create a new item and save to DB
	Item.create(newItem, function(err, newlyCreated){
		if(err){
			console.log(err);
		} else {
			//redirect back to items page
			res.redirect("/items");
		}
	});
});

// NEW ROUTE
router.get("/new", middleware.isLoggedIn, function(req,res){
	res.render("items/new");
});

//SHOW - RESTFUL ROUTE
router.get("/:id", function(req,res){
	//find the Item with the provided ID
	Item.findById(req.params.id, function(err,foundItem){
		if(err){
			res.redirect("items/index");
		} else {
			//render show template with that item
			res.render("items/show", {item: foundItem});
		}
	});
});


//update bidPrice/highestBidder Route
router.put("/:id", middleware.isLoggedIn, function(req,res){
	Item.findByIdAndUpdate(req.params.id, {$set:{highestBidder: req.user.id}, $inc:{ bidPrice: 50}}, function(err, updatedItem){
			if(err){
			console.log(err);
		} else {
			req.flash("success", "Your bid has been successful! Make sure to keep track of this item. Keep on bidding!");
			res.redirect("/items/" + req.params.id);
		}
	});
});

//DESTROY ROUTE
router.delete("/:id", middleware.isLoggedIn, function(req,res){
	Item.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/items");
		} else {
			res.redirect("/items");
		}
	});
});


module.exports = router;