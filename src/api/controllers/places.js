const { deleteFile } = require("../../utils/deleteFile");
const Place = require("../models/places");
const mongoose = require("mongoose");


const getPlaces = async (req, res, next) => {
    try {
        const places = await Place.find();

        if(!places) {
            return res.status(404).json("No se encuentran estos sitios")
        }
        return res.status(200).json(places);
      
    } catch (error) {
        return res.status(500).json({error:"Error buscando sitios", details: error.message})
    }
}

const getPlacesById = async (req, res, next) => {
    try {
        const {id} = req.params;
        const place = await Place.findById(id);

        if (!place) {
            return res.status(404).json("No se ha encontrado este lugar")
        }
        return res.status(200).json(place);
    } catch (error) {
        console.log(error);
        return res.status(400).json({error:"Error obteniendo los sitios" ,details: error.message})
    }
}

const postPlaces = async(req, res, next) =>{
    try {
        const newPlace = new Place({
            ...req.body, 
            img:{url: req.file.path}
        });

        if (!req.file) {
        return res.status(400).json({ error: "No se envió ninguna imagen" });
         }
        
        /*if (req.user.rol === "admin") {
            newPlace.verified = true;
        } else {
            newPlace.verified = false;
        }*/

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
    const updateData = {...req.body};

    if (req.file) {
     updateData.img = {url: req.file.path}
    }

    const updatedPlace = await Place.findByIdAndUpdate(id, updateData, {new: true, runValidators: true});
    if (!updatedPlace) {
        return res.status(404).json({error: "No se encontró el lugar buscado"})
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
        console.log(req.params.id);
        //preguntar por la validación que hace Santi
        if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "ID no válido" });}
        const placesDeleted = await Place.findByIdAndDelete(id);

        if (!placesDeleted) {
            return res.status(404).json("No se encuentra este lugar para borrarlo");
        };

         if (placesDeleted.img?.public_id) {
      try {
        const result = await cloudinary.uploader.destroy(placesDeleted.img.public_id);
        console.log("Imagen eliminada:", result);
      } catch (error) {
        console.log(error)
        return res.status(500).json({error: "Error eliminando imagen en Cloudinary:", details: error.message});
      }
    }
        return res.status(200).json(placesDeleted)
    } catch (error) {
        console.log(error)
        return res.status(500).json({error: "Error eliminando el lugar", details: error.message});
    }
}

module.exports = {getPlaces, getPlacesById, postPlaces, putPlaces, deletePlace};