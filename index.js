require("dotenv").config();
const express = require("express");
const { connectDB } = require("./src/config/db");
const placesRouter = require("./src/api/routes/places");


const app = express();

connectDB();
app.use(express.json());

app.use("/api/v1/places", placesRouter);

app.use( (req, res, next) => {
    return res.status(404).json("Route not found");
});

app.listen(3000, ()=>{
    console.log("Servidor funcionando en http://localhost:3000");
})