const cloudinary = require("../../utils/cloudinary");
const mongoose = require("mongoose");
const Posts = require("../models/posts");
const Place = require("../models/places");

const getPosts = async (req, res, next) => {
    try {
        const posts =  await Posts.find()
        .populate("author", "userName")
        .populate("place", "name img");

        if (posts.length === 0) {
            return res.status(200).json({message: "todavía no hay posts", data: []})
        }
        return res.status(200).json(posts)
    } catch (error) {
        return res.status(500).json({error: "Error interno del servidor"})
    }
}

const getPostById = async (req, res, next) => {
    try {
        const {id} = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "ID no válido"});
        }

        const post = await Posts.findById(id)
        .populate("place", "name img")
        
        if (!post) {
            return res.status(404).json({error: "No se encontró el post solicitado"});
        }

        return res.status(200).json(post);

    } catch (error) {
        return res.status(500).json({error: "Error interno del servidor"})
    }
}

const createPost = async (req, res, next) => {
    try {
    
    const {title, content, place} = req.body;

    if (!title || !content || !place) {
        return res.status(400).json({error: "Faltan campos obligatorios"})
    }

    if (!req.file) {
        return res.status(400).json({error: "La imagen es obligatoria"})
    }

    const placeExists = await Place.findById(place);
    if (!placeExists) {
        return res.status(404).json({error: "El lugar indicado no existe"})
    }

    const newPost = new Posts({
        title,
        content,
        author: req.user._id, 
        place,
        image: {
            url: req.file.path, 
            public_id: req.file.filename
        }
    })

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);

     } catch (error) {
        return res.status(500).json({error: "Error interno del servidor"});
    }
}

const updatePost = async (req, res, next) => {
    try {
        
        const {id} = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "ID no válido"});
        }

        const post = await Posts.findById(id);
        if (!post) {
            return res.status(404).json({error: "No se encontró el post buscado"})
        }
        const updateData = {
            title: req.body.title,
            content: req.body.content,
            place: req.body.place
        };
      
        if (req.file) {

            if (post.image?.public_id) {
                await cloudinary.uploader.destroy(post.image.public_id)
            }

            updateData.image = {
               url: req.file.path,
               public_id: req.file.filename
            };
        }
       const updatedPost = await Posts.findByIdAndUpdate(id, updateData, {new: true, runValidators: true});

       if (!updatedPost) {
        return res.status(404).json({error: "No se encontró el post buscado"})
       }

       return res.status(200).json(updatedPost);
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "Error interno del servidor"})
    }
}

const deletePost = async (req, res, next) => {
    try {
        const {id} = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "ID no válido"});
        }

        const post = await Posts.findById(id);
        if(!post) {return res.status(404).json({error: "No se encontró el post que intentas eliminar"})}

        if (req.user.rol !== "admin" && post.author.toString() !== req.user._id) {
            return res.status(403).json({error: "No tienes permisos para eliminar este usuario"})
        }

        if (post.image?.public_id) {
            await cloudinary.uploader.destroy(post.image.public_id)
        }

        await Posts.findByIdAndDelete(id);

        return res.status(200).json({message: "Post eliminado con éxito"})
    } catch (error) {
        return res.status(500).json({error: "Error interno del servidor"})
    }
}

module.exports = {getPosts, getPostById, createPost, updatePost, deletePost };