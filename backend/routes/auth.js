import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();

const users = [];

router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Vui lòng điền đầy đủ thông tin' });
        }

        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
            return res.status(400).json({ error: 'Email đã được sử dụng' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = {
            id: Date.now().toString(),
            name,
            email,
            password: hashedPassword,
            createdAt: new Date()
        };
        users.push(user);

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET || 'petcarex-secret-key',
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'Đăng ký thành công',
            user: { id: user.id, name: user.name, email: user.email },
            token
        });

    } catch (error) {
        console.error('Register Error:', error);
        res.status(500).json({ error: 'Đã xảy ra lỗi' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Vui lòng điền email và mật khẩu' });
        }

        const user = users.find(u => u.email === email);
        if (!user) {
            return res.status(401).json({ error: 'Email hoặc mật khẩu không đúng' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Email hoặc mật khẩu không đúng' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET || 'petcarex-secret-key',
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Đăng nhập thành công',
            user: { id: user.id, name: user.name, email: user.email },
            token
        });

    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ error: 'Đã xảy ra lỗi' });
    }
});

router.get('/me', (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'petcarex-secret-key');
        const user = users.find(u => u.id === decoded.id);
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ user: { id: user.id, name: user.name, email: user.email } });
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
});

export default router;
