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
	},
	created:{type:Date, default: Date.now}
});

module.exports = mongoose.model("Comment", commentSchema);