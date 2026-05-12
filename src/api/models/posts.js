const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    title: {type: String, required: true},
    content: {type: String, required: true},
    image: {
        url: {type: String, required: true}, 
        public_id: {type:String, required: true}}, 
    author: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    place: {type: mongoose.Schema.Types.ObjectId, ref: "Place", required: true}, 
},{
    timestamps:true,
    collection: "posts"
})

const Posts = mongoose.model("Post", postSchema, "posts");

module.exports = Posts;