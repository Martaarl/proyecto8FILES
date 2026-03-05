const multer = require('multer')
const cloudinary = require("../utils/cloudinary")
const { CloudinaryStorage } = require('multer-storage-cloudinary')

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'Places',
    allowedFormats: ['jpg', 'png', 'jpeg', 'gif', 'webp']}

    // para reutilización puedo poner folder: 
    /* 
    params: async (req, file) => {
      return {
      folder: req.body.type === "place" ? "Places" : "Posts",
      allowedFormats: ['jpg', 'png', 'jpeg', 'gif', 'webp']
  };
  }
  */
 });


const upload = multer({ storage });

module.exports = { upload };
