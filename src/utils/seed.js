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
        title: "Descubriendo Asturias",
        content: "Un post sobre la belleza de Asturias",
        image: "https://example.com/post-asturias.jpg", 
        placeName: "Asturias"
    }, {
        title: "Un paseo por Nueva York", 
        content: "Post sobre calle y sitios NO típicos de Nueva York", 
        image: "https://example.com/post-nuevayork.jpg",
        placeName: "Nueva York"
    }
]

const seedData = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);

        for (const place of placeData) {
            const existsPlace = await Place.findOne({name: place.name});
            if (!existsPlace) {
                await Place.create(place);
            } else {
                console.log(`El lugar "${place.name}" ya existe`)
            }
        }

        for (const post of postData) {
            const place = await Place.findOne({name: post.placeName})
            if (!place) {
                console.log(`No se encontró lugar para el post "${post.title}"`)
            }
            await Posts.create({
                ...post, 
                place: place._id,
                author: new mongoose.Types.ObjectId()
            })
        }
        
    } catch (error) {
        console.log(error)
    }

    finally {
        mongoose.disconnect()
    }
}

seedData();