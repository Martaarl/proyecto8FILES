const cloudinary = require("cloudinary").v2;
const express = require("express");
const app = express();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})

module.exports = cloudinary;