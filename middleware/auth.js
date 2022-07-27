const jwt = require('jsonwebtoken')
require('dotenv').config();

module.exports = function auth(req, res, next) {
    const header = req.header('x-auth-token')
    const token = header && header.split(' ')[1];
    
    if (!token) return res.status(401).send('Access denied. No token provided.')

    jwt.verify(token, process.env.jwtPrivateKey, (err, user) => {
        if (err) res.status(401).send(err.message)

        req.user = user;
        next();
    })
}

