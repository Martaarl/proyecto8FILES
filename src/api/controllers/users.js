
const { error } = require("console");
const { generateSign } = require("../../config/jwt.js");
const User = require("../models/users.js");
const bcrypt = require("bcrypt");


const lookForUser = async (userName) => {
    const user = await User.findOne({userName});

    if (!user) {
        return res.status(404).json("No se encuentra a este usuario")
    }

  //  user.password = undefined;
    return user;
}

const getUsers = async (req, res, next) => {
    try {
        const users = await User.find();

      /*  users.forEach(user =>{
            user.password = undefined;
        })*/

        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({error: "Error obteniendo usuarios", details: error.message});
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
        return res.status(500).json({error: "Error al actualizar el usuario", details: error.message})
    }
}

const updateUser = async (req, res, next) => {
    try {
        const {userName} = req.params;
        const {rol, newUserName, password} = req.body;

        const user = await User.findOne({userName});
        if (!user) {
            return res.status(404).json("Usuario no encontrado")
        };
/*
        if (rol) {
             if (req.user.rol !== "admin") {
            return res.status(403).json("Solo un admin puede cambiar roles")
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
                return res.status(400).json({error: "Ya existe este usuario", details: error.message})
            }
            user.userName = newUserName;
        }

        if (password) {
            if (req.user.userName !== userName) {
                return res.status(403).json({error: "Solo el propio usuario puede cambiar la contraseña", details: error.message})
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;
        }
*/
        await user.save();

        const userToShow = {
            _id: user._id,
            userName: user.userName,
            rol: user.rol
        }

        return res.status(200).json({message: "Rol actualizado", userToShow})

    } catch (error) {
        return res.status(500).json({error: "Error al actualizar el rol del usuario", details: error.message})
    }
}

const register = async (req, res, next) => {
    try {
        const newUser  = new User({
            userName: req.body.userName,
            password: req.body.password, 
            rol: "user"
        });
        const duplicateUser = await lookForUser(req.body.userName);
        
        if (duplicateUser) {
            return res.status(400).json("Este usuario ya existe");
        }
        
        const userSaved = await newUser.save();

        const userShowed = {
            _id: userSaved._id,
            userName: userSaved.userName,
            rol: userSaved.rol,
        }
        return res.status(201).json(userShowed);

    } catch (error) {
         return res.status(500).json({error: "Error registrando el usuario", details: error.message});
    }
}

const login = async (req, res, next) => {
    try {
        const user = await User.findOne({userName: req.body.userName});

        if (!user) {
            return res.status(400).json("Usuario no existente")
        } 
        if (bcrypt.compareSync(req.body.password, user.password)) {
            const token = generateSign(user.id);

            const userToReturn = {
                _id: user._id,
                userName: user.userName,
                rol: user.rol
            }

            return res.status(200).json({userToReturn, token});
        } 
        
    } catch (error) {
         return res.status(500).json({error: "Error logeando", details: error.message});
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
        res.status(500).json({error:"Error al eliminar el usuario", details: error.message})
    }
}

module.exports = {getUsers, getUserByName, updateUser, register, login, deleteUser};