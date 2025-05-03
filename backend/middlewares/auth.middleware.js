import jwt from 'jsonwebtoken';
import User  from '../models/user.model.js';


export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies['jwt-backlink'];
        if (!token) {
            return res.status(401).json({ message: "Unauthorized - No Token Provided" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized - Invalid Token" });
        }
        // Find the user by ID and exclude the password field from the result
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }
        req.user = user;
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({ message: "Unauthorized - Token Verification Failed" });
    }
}