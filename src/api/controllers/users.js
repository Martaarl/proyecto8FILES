
const { generateSign } = require("../../config/jwt.js");
const User = require("../models/users.js");
const bcrypt = require("bcrypt");


const lookForUser = async (userName) => {
    const user = await User.findOne({userName});

    if (!user) {
        return null
    }
    
    user.password = undefined;
    return user;
}

const getUsers = async (req, res, next) => {
    try {
        const users = await User.find().select("-password");
        return res.status(200).json(users);

    } catch (error) {
        return res.status(500).json({error: "Error interno del servidor"});
    }
}

const getUserByName = async (req, res, next) => {
    try {
        
        const {userName} = req.params;
        const user = await User.findOne({userName}).select("-password");

        if (!user) {
            return res.status(404).json({error:"Usuario no encontrado"});
        }

        if (req.user.rol !== "admin" && req.user.userName !== userName) {
            return res.status(403).json({error: "No tienes permisos para ver este usuario"})
        }

        return res.status(200).json(user);

    } catch (error) {
        return res.status(500).json({error: "Error interno del servidor"})
    }
}

const updateUser = async (req, res, next) => {
    try {
        const {userName} = req.params;
        const {rol, newUserName, password} = req.body;

        const user = await User.findOne({userName}).select("+password");
        if (!user) {
            return res.status(404).json({error:"Usuario no encontrado"})
        };

        if (rol) {
             if (req.user.rol !== "admin") {
            return res.status(403).json({error:"Solo un admin puede cambiar roles"})
                }

            if (!["user", "admin"].includes(rol)) {
                return res.status(400).json({error: "Rol no válido"})
            }
            user.rol = rol;
        }


        if (newUserName){
            if (req.user.rol !== "admin" && req.user.userName !== userName) {
                return res.status(403).json("No tienes permiso para cambiar este usuario")
            }
            const existName = await User.findOne({userName: newUserName});
            if (existName) {
                return res.status(400).json({error: "Ya existe este usuario"})
            }
            user.userName = newUserName;
        }

        if (password) {
            if (req.user.userName !== userName) {
                return res.status(403).json({error: "Solo el propio usuario puede cambiar la contraseña"})
            };
            user.password = password;
        }

        await user.save();

        const userToShow = {
            _id: user._id,
            userName: user.userName,
            rol: user.rol
        }

        return res.status(200).json({message: "Usuario actualizado", userToShow})

    } catch (error) {
        return res.status(500).json({error: "Error interno del servidor"})
    }
}

const register = async (req, res, next) => {
    try {
        const {userName, password} = req.body;

        if (!userName || !password) {
            return res.status(400).json({error: "Faltan campos obligatorios"})
        }
        
        const duplicateUser = await User.findOne({userName});
        
        if (duplicateUser) {
            return res.status(400).json({error:"Este usuario ya existe"});
        }

        const newUser  = new User({
            userName,
            password, 
            rol: "user"
        });

        const userSaved = await newUser.save();

        const userShowed = {
            _id: userSaved._id,
            userName: userSaved.userName,
            rol: userSaved.rol,
        }
        return res.status(201).json(userShowed);

    } catch (error) {
         return res.status(500).json({error: "Error interno del servidor"});
    }
}

const login = async (req, res, next) => {
    try {
        const {userName, password} = req.body;

        if (!userName || !password) {
            return res.status(400).json({error: "Faltan permisos"})
        }

        const user = await User.findOne({userName}).select("+password");

        if (!user) {
            return res.status(400).json({error:"Usuario o contraseña incorrectos"})
        } 

        const userCheck = bcrypt.compareSync(password, user.password);
        if (!userCheck) {
            return res.status(400).json({error: "Usuario o contraseña incorrectos"})
        }

        const token = generateSign(user._id);

        const userToReturn = {
            _id: user._id,
            userName: user.userName,
            rol: user.rol
        }

        return res.status(200).json({userToReturn, token});
        
    } catch (error) {
         return res.status(500).json({error: "Error interno del servidor"});
    }
}


const deleteUser = async (req, res, next) => {
    try {
        const {userName} = req.params;

        const user = await User.findOne({userName});
        if (!user) {
            return res.status(404).json({error: "No se encuentra al usuario"})
        }

        if(req.user.rol !=="admin" && req.user.userName !== userName){
            return res.status(403).json({error: "No tienes permisos para eliminar a este usuario"})
        }

        await User.deleteOne({userName});

        return res.status(200).json({message: "Usuario eliminado correctamente"});
    } catch (error) {
        res.status(500).json({error:"Error interno del servidor"})
    }
}

module.exports = {getUsers, getUserByName, updateUser, register, login, deleteUser, lookForUser};