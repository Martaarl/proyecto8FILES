const cloudinary = require("cloudinary");
const Posts = require("../models/posts");
const { ifError } = require("assert");

const getPosts = async (req, res, next) => {
    try {
        const posts =  await Posts.find();

        if (!posts) {
            return res.status(404).json({error: "no se han encontrado posts acerca de esto"})
        }

        return res.status(200).json(posts)
    } catch (error) {
        return res.status(400).json("Error obteniendo posts")
    }
}

module.exports = {getPosts};