//ITEM SCHEMA/MODEL
var mongoose = require("mongoose");

var itemSchema = new mongoose.Schema({
	name:String,
	price: Number,
	highestBidder: String,
	image:String,
	description: String,
	created:{type:Date, default: Date.now},
	endDate:Date,
	author: {
		id:{
			type:mongoose.Schema.Types.ObjectId,
			ref:"User"
		},
		username:Number,
		name:String
	},
	comments:[
	{
		type: mongoose.Schema.Types.ObjectId,
		ref:"Comment"
	}
	]
});

module.exports = mongoose.model("Item", itemSchema);