import authRouter from './auth.js';
import userRoutes from './user.route.js';
import chatbotRouter from './chatbot.js';

export default function route(app) {
    app.use('/api/auth', authRouter);
    app.use('/api/users', userRoutes);
    app.use('/api/chatbot', chatbotRouter);
    app.use('/', (req, res) => {
        return res.json({message: "Hello"});
    });
};
