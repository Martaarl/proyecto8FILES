const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    title: {type: String, required: true},
    content: {type: String, required: true},
    image: {
        url: {type: String, required: true}, 
        public_id: {type:String, required: true}}, 
    author: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    place: {type: mongoose.Schema.Types.ObjectId, ref: "Place", required: true}, 
    userPlace: [
        {
            user:{type: mongoose.Schema.Types.ObjectId, ref: "User"},
            place: {type: mongoose.Schema.Types.ObjectId, ref: "Place"},
            image: {type: String},
            comment: {type: String},
            createdAt: {type: Date, default: Date.now}
        }
    ]
},{
    timestamps:true,
    collection: "posts"
})

const Posts = mongoose.model("Post", postSchema, "posts");

module.exports = Posts;