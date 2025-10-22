const mongoose = require("mongoose");


const placesSchema = new mongoose.Schema({
    img: {type: String, required: true}, 
    name: {type: String, required: true}, 
    date: {type: String, required: true},
    creator: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    likesCounter: {type: Number, default: 0}
},
{
    timestamps: true, 
    collection: "places"
})

const Place = mongoose.model("places", placesSchema, "places")
module.exports= Place;