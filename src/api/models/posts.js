const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    title: {type: String, required: true},
    content: {type: String, required: true},
    image: {type: String, url: String},// esta la obvio porque relaciono mi colección desde place, no tengo que crear este parámetro y así puedo reutilizar textos verdad?
    author: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true}, 
    place: {type: mongoose.Schema.Types.ObjectId, ref: "Place", required: true}
},{
    timestamps:true,
    collection: "posts"
})

const Posts = mongoose.model("Post", postSchema, "posts");

module.exports = Posts;