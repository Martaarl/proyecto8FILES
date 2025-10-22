const { log } = require("console");

const cloudinary = require("cloudinary").v2;

const deleteFile = (url) =>{
     cloudinary.uploader.destroy("nombreCarpeta/nombreArchivo", () => {
        console.log("Destruido");
     })
}

module.exports = {deleteFile};