//COMMENT SCHEMA / MODEL
var mongoose = require("mongoose");

var commentSchema = mongoose.Schema({
	text:String,
	author:{
		id:{
			type:mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username:Number,
		name: String,
		lname:String
	}
});

module.exports = mongoose.model("Comment", commentSchema);