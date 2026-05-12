require ("dotenv").config();
const mongoose = require("mongoose");
const Place = require("../api/models/places");
const Posts = require("../api/models/posts");
const User = require("../api/models/users");


const userData = [
    {
        userName: "marta",
        password: "123456"
    },
    {
        userName: "admin",
        password: "123456",
        rol: "admin"
    }
]
const placeData = [
    {
        name: "Asturias",
        date: new Date(),
        img: {url: "https://example.com/asturias.jpg", public_id: "asturias1"}
    }, 
    {
        name: "Nueva York",
        date: new Date(),
        img: {url: "https://example.com/nuevayork.jpg", public_id: "nuevayork1"}
    }
]

const postData = [
    {
        title: "Descubriendo Asturias",
        content: "Un post sobre la belleza de Asturias",
        image: {url: "https://example.com/post-asturias.jpg", public_id: "post-asturias"}, 
        placeName: "Asturias"
    }, {
        title: "Un paseo por Nueva York", 
        content: "Post sobre calle y sitios NO típicos de Nueva York", 
        image: {url: "https://example.com/post-nuevayork.jpg", public_id: "post-nuevayork"},
        placeName: "Nueva York"
    }
]

const seedData = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);

        const users = await User.insertMany(userData);

        for (const place of placeData) {
            const existsPlace = await Place.findOne({name: place.name});
            if (!existsPlace) {
                await Place.create({
                ...place,
                author: users [0]._id    
            });
            } else {
                console.log(`El lugar "${place.name}" ya existe`)
            }
        }

        for (const post of postData) {
            const place = await Place.findOne({name: post.placeName})
            if (!place) {
                console.log(`No se encontró lugar para el post "${post.title}"`)
            }

            const newPost = {
                title: post.title,
                content: post.content,
                image: post.image,
                place: place._id,
                author: users[0]._id
            }

            await Posts.create(newPost);
        }
        
    } catch (error) {
        console.log("Error en la semilla", error)
    }

    finally {
        mongoose.disconnect();
    }
}

seedData();