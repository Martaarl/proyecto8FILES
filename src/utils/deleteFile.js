const { log } = require("console");

const cloudinary = require("cloudinary").v2;

const deleteFile = (url) =>{
      console.log(url);
     cloudinary.uploader.destroy("nombreCarpeta/nombreArchivo", () => {
        console.log("Destruido");
        //min 38 clase Santi para configurar bien que se elimine en cloudinary
        
     })
}

module.exports = {deleteFile};