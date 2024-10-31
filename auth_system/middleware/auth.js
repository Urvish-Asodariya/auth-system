const jwt = require('jsonwebtoken');

exports.auth = (req, res, next) => {
    // const token = req.header('Authorization')?.split(' ')[1];  // here is two way to access token which provided by frontend
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
        const error = {
            status: 401,
            message: 'Access denied. No token provided.'
        };
        return res.send(error);
    } else {
        try {
            const verified = jwt.verify(token, process.env.SECRET_KEY);
            req.user = verified;
            next();
        } catch (err) {
            const error = {
                status: err.status,
                message: "Invalid token"
            };
            return res.send(error);
        }
    }
};

