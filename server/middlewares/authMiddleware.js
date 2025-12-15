import jwt from 'jsonwebtoken';
import User from '../app/models/User.js';

export const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Unauthorized - No token provided' });
        }
        
        const token = authHeader.split(' ')[1];
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const user = await User.findById(decoded.id);
        
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized - User not found' });
        }
        
        req.user = {
            id: user._id,
            username: user.username,
            email: user.email
        };
        
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Unauthorized - Token expired' });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Unauthorized - Invalid token' });
        }
        console.error('Auth middleware error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export default authMiddleware;
