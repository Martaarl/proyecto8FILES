const User = require("../api/models/users");
const { verifyJwt } = require("../config/jwt");

const isAuth = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(400).json({error:"No se ha enviado ningún token", details: error})
        }

        const parsedToken = token.replace("Bearer ", "");
        const {userId} = verifyJwt(parsedToken);
        
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({error: "Usuario no encontrado", details: error})
        }

        user.password = null;
        req.user = user;
        next();

    } catch (error) {
        return res.status(401).json({error:"No estás autorizado"})
    }
}

const isAdmin = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({error: "No se ha enviado ningún token"})
        }
        const parsedToken = token.replace("Bearer ", "");
        const {userId} = verifyJwt(parsedToken);

        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({error: "Usuario no encontrado", details: error})
        }

        if (user.rol !== "admin") {
            return res.status(403).json({error: "Solo pueden utilizar esta función los administradores"})
        }
        
        user.password = null;
        req.user =user;
        next();

    } catch (error) {
        return res.status(401).json({error:"No estás autorizado"})
    }
}

module.exports = {isAuth, isAdmin};