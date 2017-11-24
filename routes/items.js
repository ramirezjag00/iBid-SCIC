var express = require("express");
var router = express.Router();
var Item = require("../models/item");
var middleware = require("../middleware");

//INDEX ROUTE
router.get("/", function(req,res){
    var noMatch = null;
    if(req.query.search){
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Item.find({name: regex}, function(err, allItems){
            if(err){
                console.log(err);
            } else {
                if(allItems.length === 0){
                    noMatch = "'"+req.query.search+"'"+ " did not match items";
                }
                // eval(require("locus"))
                res.render("items/index", {items:allItems, page:"items", noMatch:noMatch});
            }         
        });
    } else {
        Item.find({}, function(err, allItems){
            if(err){
                console.log(err);
            } else {
                res.render("items/index", {items:allItems, page:"items", noMatch:noMatch});
            }
        });
    }
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
			req.flash("success", "Item deleted!");
			res.redirect("/items");
		}
	});
});

//def for search
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

module.exports = router;