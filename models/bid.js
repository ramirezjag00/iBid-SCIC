//BID SCHEMA / MODEL
var mongoose = require("mongoose");

var bidSchema = mongoose.Schema({
    author:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username:Number,
        name: String,
        lname:String
    },
    item_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item"
    },
    bidDate: Date
});

module.exports = mongoose.model("Bid", bidSchema);