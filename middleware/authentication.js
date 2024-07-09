const jwt = require('jsonwebtoken');
const secret = process.env.SECRET_KEY;

exports.authenticate = function(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "Token not found" });
    }

    const token = authHeader
    console.log('Token:', token);

    jwt.verify(token, secret, (error, decoded) => {
        if (error) {
            return res.status(401).json({ message: `Authentication error: ${error.message}` });
        } else {
            req.user = decoded;
            next();
        }
    });
};
