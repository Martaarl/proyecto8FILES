const { deleteFile } = require("../../utils/deleteFile");
const Place = require("../models/places");
const cloudinary = require("cloudinary");

const getPlaces = async (req, res, next) => {
    try {
        const places = await Place.find();
        //preguntar como práctica el meter si no existe places para especificar más el error
        if(!places) {
            return res.status(404).json("no hay sitios")
        }
        return res.status(200).json(places);
      
    } catch (error) {
        return res.status(400).json({error: "error buscando sitios"})
    }
}

const getPlacesById = async (req, res, next) => {
    try {
        const {id} = req.params;//preguntar por la mejor práctica para esto
        const place = await Place.findById(id);

        if (!place) {
            return res.status(404).json("No se ha encontrado este lugar")
        }
        return res.status(200).json(place);
    } catch (error) {
        return res.status(400).json({error: error.message})
    }
}

const postPlaces = async(req, res, next) =>{
    try {
         if (!req.file) {
        return res.status(400).json({ error: "No se envió ninguna imagen" });
         }
        const newPlace = new Place({
            ...req.body, 
            img:{url: req.file.path}
        });
        
        /*if (req.user.rol === "admin") {
            newPlace.verified = true;
        } else {
            newPlace.verified = false;
        }*/

        const placeSaved = await newPlace.save();
        return res.status(201).json(placeSaved);
    } catch (error) {
        return res.status(400).json({error: "Error publicando un nuevo lugar"
        })
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
        return res.status(400).json({error: "Error actualizando el lugar"})
    }
}

const deletePlace = async(req, res, next) => {
    try {
        const {id} = req.params;
        const placesDeleted = await Place.findByIdAndDelete(id);

        deleteFile(placesDeleted.img);

        if (!placesDeleted) {
            return res.status(404).json("No se encuentra este lugar para borrarlo")
        }

        return res.status(200).json(placesDeleted)
    } catch (error) {
        return res.status(400).json("Error eliminando el lugar")
    }
}

module.exports = {getPlaces, getPlacesById, postPlaces, putPlaces, deletePlace};