//ITEM SCHEMA/MODEL
var mongoose = require("mongoose");

var itemSchema = new mongoose.Schema({
	name:String,
	image:String,
	description: String,
	comments:[
	{
		type: mongoose.Schema.Types.ObjectId,
		ref:"Comment"
	}
	]
});

module.exports = mongoose.model("Item", itemSchema);