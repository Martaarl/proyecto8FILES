const mongoose = require("mongoose");


const placesSchema = new mongoose.Schema({
    img: {  
    public_id: { type: String },
    url: { type: String, required: true }
    }, 
    name: {type: String, required: true}, 
    date: {type: String, required: true}, // no he puesto Date porque quiero que sea tipo Summer25 
   // creator: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
},
{
    timestamps: true, 
    collection: "places"
})

const Place = mongoose.model("places", placesSchema, "places")
module.exports= Place;