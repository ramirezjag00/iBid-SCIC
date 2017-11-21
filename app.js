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
var Bid = require("./models/bid")
var methodOverride = require("method-override");
var seedDB = require("./seeds");

//requiring routes
var commentRoutes = require("./routes/comments");
var itemRoutes = require("./routes/items");
var indexRoutes = require("./routes/index");
var bidRoutes = require("./routes/bids")

//APP CONFIG
mongoose.connect("mongodb://localhost/ibid_v4fixed", {useMongoClient: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
//seedDB(); //seed the database
app.use(methodOverride("_method"));


//PASSPORT CONFIG
app.use(require("express-session")({
	secret:"fpvpavargrrafriraglfvk",
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

//ROUTES APP CONFIG
app.use("/", indexRoutes);
app.use("/items", itemRoutes);
app.use("/items/:id", commentRoutes);
app.use("/items/:id", bidRoutes);

//SERVER
app.listen(process.env.PORT, process.env.IP, function(){
	console.log("iBid SERVER STARTED");
});

app.listen(27017);
