import authRouter from './auth.js';
import userRouter from './user.js';
import chatbotRouter from './chatbot.js';
import emailRouter from './email.js';

export default function route(app) {
    app.use('/api/auth', authRouter);
    app.use('/api/users', userRouter);
    app.use('/api/chatbot', chatbotRouter);
    app.use('/api/email', emailRouter);
};
