var express = require("express");
var router = express.Router();
var Item = require("../models/item");

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
router.post("/", function(req,res){
	var name = req.body.name;
	var price = req.body.price;
	var endDate = req.body.endDate;
	var image = req.body.image;
	var desc = req.body.description;
	var newItem = {name: name, image: image, price:price, endDate:endDate, description:desc};
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
router.get("/new", function(req,res){
	res.render("items/new");
});

//SHOW ROUTE
router.get("/:id", function(req,res){
	//find the item with the provided ID
	Item.findById(req.params.id).populate("comments").exec(function(err, foundItem){
		if(err){
			console.log(err);
		} else {
			console.log(foundItem);
			//render show template with that item
			res.render("items/show", {item: foundItem});
		}
	})
});

module.exports = router;