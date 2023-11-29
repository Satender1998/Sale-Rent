import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";

// Middleware to verify the authenticity of a token
export const verifyToken = (req, res, next) => {
    // Extracting the token from the cookies
    const token = req.cookies.access_token;

    // Checking if a token is present
    if (!token) return next(errorHandler(401, 'Unauthorized'));

    // Verifying the token using the JWT library
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        // Handling token verification errors
        if (err) return next(errorHandler(403, 'Forbidden'));

        // Assigning the user object to the request for further use
        req.user = user;

        // Passing control to the next middleware
        next();
    });
};
