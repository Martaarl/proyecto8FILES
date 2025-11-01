const cloudinary = require("cloudinary");
const CloudinaryStorage = require("multer-storage-cloudinary");
const multer = require ("multer");
const mongoose = require("mongoose");
const Posts = require("../models/posts");
const Place = require("../models/places");

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

const getPostById = async (req, res, next) => {
    try {
        const {id} = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "ID no válido" });
        }

        const post = await Posts.findById(id)
        //.populate("author", "name")
        .populate("place", "name img")
        
        if (!post) {
            return res.status(404).json({error: "No se encontró el post solicitado"});
        }

        return res.status(200).json(post);
    } catch (error) {
        return res.status(400).json({error: "Error al obtener este post", details: error.message})
    }
}

const createPost = async (req, res, next) => {
    try {
    
    const {title, content,/* author,*/ place} = req.body;

    if (!title || !content || /*!author ||*/ !place) {
        return res.status(400).json({error: "Faltan campos obligatorios"})
    }

    const placeExists = await Place.findById(place);
    if (!placeExists) {
        return res.status(404).json({error: "El lugar indicado no existe"})
    }

    const newPost = new Posts({
        ...req.body, 
        image: req.file.path || null
    })

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
     } catch (error) {
        console.log(error);
        return res.status(500).json({error: "Error creando el post", details: error.message});
    }
}

const updatePost = async (req, res, next) => {
    try {
        
        const {id} = req.params;
        const updateData = {...req.body};
      
        if (req.file) {
            console.log("Archivo recibido:", req.file);

            updateData.image = req.file.path;
        }
       const updatedPost = await Posts.findByIdAndUpdate(id, updateData, {new: true, runValidators: true});

       if (!updatedPost) {
        return res.status(404).json({error: "No se encontró el post buscado"})
       }

       return res.status(200).json(updatedPost);
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "Error al actualizar el post", details: error.message})
    }
}

const deletePost = async (req, res, next) => {
    try {
        const {id} = req.params;

        const deletedPost = await Posts.findByIdAndDelete(id);

        if (!deletedPost) {
            return res.status(404).json({error: "No se encontró el post que intentas eliminar"})
        }
        return res.status(200).json({message: "Post eliminado con éxito"})
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "Error al eliminar el post", details: error.message})
    }
}

module.exports = {getPosts, getPostById, createPost, updatePost, deletePost };