const jwt = require("jsonwebtoken");
const User = require("../models/users");

const isPremium = async(req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json({
            success: false,
            message: "Unauthorised user"
        });
    }
    const token = authorization.split(" ")[1];
    try {
        const { _id } = jwt.verify(token, process.env.JWT_SECRET);
        const user = await Users.findOne(_id, {
            attributes: { isPremium }
        });
        if (user.isPremium == true) {
            req.user = user;
            next();
        }
        else {
            return res.status(400).json({
                success: false,
                message: "Not a premium user"
            });
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({
            success: false,
            message: "Not able to verify premium membership"
        });
    }
}

module.exports = isPremium;