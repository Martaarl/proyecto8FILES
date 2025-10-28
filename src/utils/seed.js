require ("dotenv").config();
const mongoose = require("mongoose");
const Place = require("../api/models/places");
const Posts = require("../api/models/posts");

const placeData = [
    {
        name: "Asturias",
        date: new Date(),
        img: {url: "https://example.com/asturias.jpg", public_id: "asturias1"},
        author: new mongoose.Types.ObjectId()
    }, 
    {
        name: "Nueva York",
        date: new Date(),
        img: {url: "https://example.com/nuevayork.jpg", public_id: "nuevayork1"},
        author: new mongoose.Types.ObjectId()
    }
]

const postData = [
    {
        title: "",
        content: "",
        author: "",
        placeName: "", 
        image: ""
    }, {
        title: "", 
        content: "", 
        author: "",
        placeName:"",
        image: ""
    }
]