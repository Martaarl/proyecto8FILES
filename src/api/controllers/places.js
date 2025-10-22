const Place = require("../models/places");

const getPlaces = async (req, res, next) => {
    try {
        const places = await Place.find();
        //preguntar como práctica el meter si no existe places para especificar más el error
        if(!places) {
            return res.status(404).json("No se ha encontrado ningún sitio")
        }
        return res.status(200).json("Aquí están los sitios que hemos visitado");
      
    } catch (error) {
        return res.status(400).json({error: "error buscando sitios"})
    }
}

const postPlaces = async(req, res, next) =>{
    try {
        const newPlace = new Place(req.body);
        const placeSaved = await newPlace.save();
        return res.status(201).json(placeSaved);
    } catch (error) {
        return res.status(400).json({error: "Error publicando un nuevo lugar"
        })
    }
}

module.exports = {getPlaces, postPlaces};