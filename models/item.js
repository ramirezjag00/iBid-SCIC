//ITEM SCHEMA/MODEL
var mongoose = require("mongoose");

var itemSchema = new mongoose.Schema({
	name:String,
	price: Number,
	bidPrice: Number,
	highestBidder: String,
	image:String,
	description: String,
	created:{type:Date, default: Date.now},
	endDate:{type:Date, default: +new Date() + 7*24*60*60*1000},
	author: {
		id:{
			type:mongoose.Schema.Types.ObjectId,
			ref:"User"
		},
		username:String,
		name:String
	}
});

module.exports = mongoose.model("Item", itemSchema);