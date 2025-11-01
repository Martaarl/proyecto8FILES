const { log } = require("console");

const cloudinary = require("cloudinary").v2;

const deleteFile = (url) =>{
      console.log(url);
      if (!url || typeof url !== "string") {
      console.warn("⚠️ URL no válida para eliminar:", url);
      return;
  }
      const imgUrl = "https://res.cloudinary.com/dmfekrd9l/image/upload/v1761640556/Places/grdskzzzro7czgmvxcpt.jpg";

      const imgSplited = url.split("/");

      const forlderName = imgSplited.at(-2);
      const fileName = imgSplited.at(-1).split(".")[0];

      console.log(forlderName);
      console.log(fileName);
      cloudinary.uploader.destroy(`${forlderName}/${fileName}`, () => {
        console.log("Destroyed");
     })
}


module.exports = {deleteFile};