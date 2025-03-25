const jwt = require('jsonwebtoken');

const secretKey = 'secretnyklusch123';

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, secretKey, (err, user) => {
            if (err) {
                return res.sendStatus(403); // Запрещено
            }

            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401); // Не авторизован
    }
};

module.exports = authMiddleware