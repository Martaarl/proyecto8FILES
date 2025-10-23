const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const usersSchema = new mongoose.Schema({
    userName: {type: String, required: true},
    password: {type: String, required: true}, 
    rol: {
        type: String, 
        required: true, 
        enum: ["admin", "user"], 
        default: "user",
    }, 
    favoritePlaces: [{ type: mongoose.Types.ObjectId, ref: "Place"}]
}, {
    timestamps: true, 
    collection: "users"
})

usersSchema.pre("save", function (){
    this.password = bcrypt.hashSync(this.password, 10);
})

const User = mongoose.model("User", usersSchema, "users");
module.exports = User;