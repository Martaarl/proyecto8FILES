const User = require("../api/models/users");
const { verifyJwt } = require("../config/jwt");

const isAuth = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        const parsedToken = token.replace("Bearer ", "");

        const {userId} = verifyJwt(parsedToken);
        
        const user = await User.findById(userId);
        
        user.password = null;
        req.user = user;
        next();

    } catch (error) {
        return res.status(400).json("No estás autorizado")
    }
}

const isAdmin = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        const parsedToken = token.replace("Bearer ", "");

        const {userId} = verifyJwt(parsedToken);
        
        const user = await User.findById(userId);
        
        if(user.rol === "admin") {
        user.password = null;
        req.user = user;
        next();
        } else {
            return res.status(400).json ("Solo puedes utilizar esta función si eres administrador");
        }

    } catch (error) {
        return res.status(400).json("No estás autorizado")
    }
}

module.exports = {isAuth, isAdmin};