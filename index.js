require("dotenv").config();
const express = require("express");
const { connectDB } = require("./src/config/db");
const mainRouter = require("./src/api/routes/main");

connectDB();

app.use(express.json());
app.use("/api/v1", mainRouter);

app.use( (req, res, next) => {
    return res.status(404).json("Route not found");
});

app.listen(3000, ()=>{
    console.log("Servidor funcionando en http://localhost:3000");
})