const mongoose = require("mongoose");

const placesSchema = new mongoose.Schema({
    img: {  
    public_id: { type: String },
    url: { type: String}
    }, 
    name: {type: String, required: true}, 
    date: {type: Date}, 
    author: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    verified: {
        type: Boolean, 
        default: false
    }
},
{
    timestamps: true, 
    collection: "places"
})

const Place = mongoose.model("Place", placesSchema, "places")
module.exports= Place;