import jwt from "jsonwebtoken"
import User from "../models/user.model.js"

const getUserMidleware = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Token not found" })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ message: "Expire token" })

        }

        const user = await User.findById(decoded.userId).select("-password");
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: "User Middleware error", err: error.message })
    }
}

export default getUserMidleware;