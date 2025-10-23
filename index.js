require("dotenv").config();
const express = require("express");
const { connectDB } = require("./src/config/db");
const placesRouter = require("./src/api/routes/places");
const postsRouter = require("./src/api/routes/posts");

const cloudinary = require("cloudinary").v2;


const app = express();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})

connectDB();
app.use(express.json());

app.use("/api/v1/places", placesRouter);
app.use("/api/v1/posts", postsRouter);

app.use( (req, res, next) => {
    return res.status(404).json("Route not found");
});

app.listen(3000, ()=>{
    console.log("Servidor funcionando en http://localhost:3000");
})