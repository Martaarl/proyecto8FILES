const { generateSign } = require("../../config/jwt.js");
const User = require("../models/users.js");
const bcrypt = require("bcrypt");


const lookForUser = async (userName) => {
    const user = await User.findOne({userName});
    return user;
}

const getUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        return res.status(200).json(users);
    } catch (error) {
        return res.status(400).json(error);
    }
}

const getUserByName = async (req, res, next) => {
    try {
        
        const {userName} = req.params;
        const user = await User.findOne({userName});

        if (!user) {
            return res.status(404).json("Usuario no encontrado");
        }

        if (req.user.rol !== "admin" && req.user.userName !== userName) {
            return res.status(403).json({message: "No tienes permisos para ver este usuario"})
        }

        user.password = undefined;

        return res.status(200).json(user);

    } catch (error) {
        return res.status(400).json({message: "Error al actualizar el usuario"})
    }
}

const updateUser = async (req, res, next) => {
    try {
        const {userName} = req.params;
        const {rol} = req.body;

        const user = await User.findOne({userName});
        if (!user) {
            return res.status(404).json("Usuario no encontrado")
        };

        if (req.user.rol !== "admin") {
            return res.status(403).json("Solo un admin puede cambiar roles")
        }

        user.rol = rol;
        await user.save();

        return res.status(200).json({message: "Rol actualizado", user})

    } catch (error) {
        return res.status(400).json("Error al actualizar el rol del usuario")
    }
}

const register = async (req, res, next) => {
    try {
        const newUser  = new User({
            userName: req.body.userName,
            password: req.body.password, 
            rol: req.body.rol && req.body.rol === "admin" ? "admin" : "user"
        });
        const duplicateUser = await lookForUser(req.body.userName);
        
        if (duplicateUser) {
            return res.status(400).json("Busca otro nombre artista");
        }
        
        const userSaved = await newUser.save();
        return res.status(201).json(userSaved);

    } catch (error) {
         return res.status(400).json(error);
    }
}

const login = async (req, res, next) => {
    try {
        const user = await User.findOne({userName: req.body.userName});

        if (!user) {
            return res.status(400).json("usuario no existente")
        } 
        if (bcrypt.compareSync(req.body.password, user.password)) {
            const token = generateSign(user.id);
            return res.status(200).json({user, token});
        } else {
            return res.status(400).json("La contraseña está mal, artista");
        }
        
    } catch (error) {
         return res.status(400).json(error);
    }
}
const deleteUser = async (req, res, next) => {
    try {

        const {userName} = req.params;
        const user = await User.findOne({userName});
        if (!user) {
            return res.status(400).json("No se encuentra al usuario")
        }

        if(req.user.rol !=="admin" && req.user.userName !== userName){
            return res.status(403).json("No tienes permisos para eliminar a este usuario")
        }

        await User.deleteOne({userName})
        return res.status(200).json({message: "Usuario eliminado correctamente"})
    } catch (error) {
        res.status(400).json("Error al eliminar el usuario")
    }
}

module.exports = {getUsers, getUserByName, updateUser, register, login, deleteUser};