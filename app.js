//SET UP
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
	//passport - to authenticate with username/password
var passport = require("passport");
var LocalStrategy = require("passport-local");
var Item = require("./models/item");
var Comment = require("./models/comment");
var User = require("./models/user");
var methodOverride = require("method-override");
var seedDB = require("./seeds");

//APP CONFIG
mongoose.connect("mongodb://localhost/ibid_v1", {useMongoClient: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
seedDB();


//PASSPORT CONFIG
app.use(require("express-session")({
	secret:"WOOOOOOOOOOOOO",
	resave:false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	next();
});


//ROOT ROUTE
app.get("/", function(req,res){
	res.render("landing");
});

//INDEX ROUTE
app.get("/items", function(req,res){
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
app.post("/items", function(req,res){
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var newItem = {name: name, image: image, description:desc};
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
app.get("/items/new", function(req,res){
	res.render("items/new");
});

//SHOW ROUTE
app.get("/items/:id", function(req,res){
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

//COMMENT ROUTES

app.get("/items/:id/comments/new", isLoggedIn, function(req, res){
		//find item by id
		Item.findById(req.params.id, function(err,item){
			if(err){
				console.log(err);
			} else {
				res.render("comments/new", {item: item});
			}
		});
});

app.post("/items/:id/comments/", isLoggedIn, function(req,res){
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
					//connect new comment to item
					item.comments.push(comment);
					item.save();
					//redirect to item show page
					res.redirect("/items/"+ item._id);
				}
			});
		}
	});
});

//AUTH ROUTES

//register route
//show register form
app.get("/register", function(req,res){
	res.render("register");
});

//handle sign up logic
app.post("/register", function(req,res){
	var newUser = new User({username:req.body.username});
	User.register(newUser, req.body.password, function(err,user){
		if(err){
			console.log(err);
			return res.render("register");
		}
		passport.authenticate("local")(req,res,function(){
			res.redirect("/items");
		});
	});
});

//log in route
//show log in form

app.get("/login", function(req,res){
	res.render("login");
});

//handling log in logic
app.post("/login",passport.authenticate("local", 
	{
	successRedirect:"/items", 
	failureRedirect: "/login"
	}), function(req,res){
});

//log out route
app.get("/logout", function(req,res){
	req.logout();
	res.redirect("/items");
});

function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}


//SERVER
app.listen(process.env.PORT, process.env.IP, function(){
	console.log("iBid SERVER STARTED");
});

app.listen(27017);
