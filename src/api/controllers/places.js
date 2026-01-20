const { error } = require("console");
const Place = require("../models/places");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;


const getPlaces = async (req, res, next) => {
    try {
        const places = await Place.find();

        if(places.length === 0) {
            return res.status(404).json({error:"No se encuentran estos sitios"})
        }
        return res.status(200).json(places);
      
    } catch (error) {
        return res.status(500).json({error:"Error buscando sitios", details: error.message})
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
        return res.status(500).json({error:"Error obteniendo el lugar", details: error.message})
    }
}

const postPlaces = async(req, res, next) =>{
    try {
        const newPlace = new Place({
            ...req.body, 
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
        console.error(error);
        return res.status(500).json({ error: "Error publicando un nuevo lugar", details: error.message });
        }
    }

const putPlaces = async (req, res, next) => {
    try {
    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "ID no válido", details: error.message});
    };

    const updateData = {...req.body};

    if (req.file) {
     updateData.img = {url: req.file.path, public_id: req.file.filename}
    }

    const updatedPlace = await Place.findByIdAndUpdate(id, updateData, {new: true, runValidators: true});
    if (!updatedPlace) {
        return res.status(404).json({error: "No se encontró el lugar buscado", details: error.message})
    }

    return res.status(200).json(updatedPlace);

    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "Error actualizando el lugar", details: error.message})
    }
}

const deletePlace = async(req, res, next) => {
    try {
        const {id} = req.params;
        //preguntar por la validación que hace Santi
        if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "ID no válido" });}
        
        const placesDeleted = await Place.findByIdAndDelete(id);

        if (!placesDeleted) {
            return res.status(404).json("No se encuentra este lugar para borrarlo");
        };

         if (placesDeleted.img?.public_id) {
            try {
                const result = await cloudinary.uploader.destroy(placesDeleted.img.public_id)
            } catch (error) {
                return res.status(500).json({error: "Error eliminando imagen en Cloudinary:", details: error.message});
            }
         }
        return res.status(200).json(placesDeleted);

    } catch (error) {
        return res.status(500).json({error: "Error eliminando el lugar", details: error.message});
    }
}

module.exports = {getPlaces, getPlacesById, postPlaces, putPlaces, deletePlace};