const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    var token;
    try {
        if (req.get("Authorization")) {
            token = req.get("Authorization").split(" ")[1];
        } else {
            const error = new Error("Not authenticated.!");
            error.statusCode = 401;
            throw error;
        }
        let decodedToken;
        try {
            decodedToken = jwt.verify(token, "thisismyprivatesecret");
        } catch (err) {
            err.statusCode = 500;
            throw err;
        }
        if (!decodedToken) {
            const error = new Error("Not authenticated.!");
            error.statusCode = 401;
            throw error;
        }
        req.userId = decodedToken.id;
    } catch (err) {
        return res.status(err.statusCode).json({message: err.message});
    }

    next();
};