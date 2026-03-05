const jwt = require('jsonwebtoken');

module.exports = function auth(req, res, next) {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '') || 
                      req.cookies?.token;

        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: 'Нет токена авторизации' 
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ 
            success: false, 
            message: 'Токен недействителен' 
        });
    }
};
