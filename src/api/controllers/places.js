
const Place = require("../models/places");
const mongoose = require("mongoose");
const cloudinary = require("../../utils/cloudinary");


const getPlaces = async (req, res, next) => {
    try {
        const places = await Place.find();

        if(places.length === 0) {
            return res.status(200).json({message:"No hay lugares todavía"})
        }
        return res.status(200).json(places);
      
    } catch (error) {
        return res.status(500).json({error:"Error interno del servidor"})
    }
}

const getPlacesById = async (req, res, next) => {
    try {
        const {id} = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "ID no válido"});
        };

        const place = await Place.findById(id);

        if (!place) {
            return res.status(404).json({error:"No se ha encontrado este lugar"})
        }
        return res.status(200).json(place);

    } catch (error) {
        console.log(error);
        return res.status(500).json({error:"Error interno del servidor"})
    }
}

const postPlaces = async(req, res, next) =>{
    try {
        const newPlace = new Place({
            name: req.body.name, 
            date: req.body.date,
            author: req.user._id,
            img: req.file ? {url: req.file.path, public_id: req.file.filename} : undefined
        });
        
        if (req.user.rol === "admin") {
            newPlace.verified = true;
        } else {
            newPlace.verified = false;
        }

        const placeSaved = await newPlace.save();
        return res.status(201).json(placeSaved);

    } catch (error) {
        return res.status(500).json({ error: "Error interno del servidor"});
        }
    }

const putPlaces = async (req, res, next) => {
    try {
    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "ID no válido"});
    };

    const place = await Place.findById(id);
    if (!place) {
        return res.status(404).json({error: "No se encontró el lugar buscado"})
    }

    const updateData = {
        name: req.body.name, 
        date: req.body.date
    };

    if (req.file) {
        if (place.img?.public_id) {await cloudinary.uploader.destroy(place.img.public_id)}
        updateData.img = {url: req.file.path, public_id: req.file.filename}
    }

    const updatedPlace = await Place.findByIdAndUpdate(id, updateData, {new: true, runValidators: true});
    if (!updatedPlace) {
        return res.status(404).json({error: "No se encontró el lugar buscado"})
    }

    return res.status(200).json(updatedPlace);

    } catch (error) {
        return res.status(500).json({error: "Error interno del servidor"})
    }
}

const deletePlace = async(req, res, next) => {
    try {
        const {id} = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "ID no válido" });}
        
        const placesDeleted = await Place.findByIdAndDelete(id);

        if (!placesDeleted) {
            return res.status(404).json({error:"No se encuentra este lugar para borrarlo"});
        };

         if (placesDeleted.img?.public_id) {
         await cloudinary.uploader.destroy(placesDeleted.img.public_id)
         }
        return res.status(200).json(placesDeleted);

    } catch (error) {
        return res.status(500).json({error: "Error interno del servidor"});
    }
}

module.exports = {getPlaces, getPlacesById, postPlaces, putPlaces, deletePlace};