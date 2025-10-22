const jwt = require("jsonwebtoken");

const generateSign = (userId) => {
    return jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: "1y"});
}

const verifyJwt = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports={generateSign, verifyJwt};