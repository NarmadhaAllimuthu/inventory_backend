
const jwt = require("jsonwebtoken");

 function auth(req, res, next) {
    if (req.headers.authorization) { 
        try {
            const verify =  jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
            if (verify) {
                next();
            } else { 
                return res.status(401).json({ message: "Unauthorized" });
            }
        } catch (error) {
            res.status(400).send("Invalid token.");
        }
    } else {
        res.status(401).json({ message: "Unauthorized: No token provided" });
    }
}

module.exports = auth;





