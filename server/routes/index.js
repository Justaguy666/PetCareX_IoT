import authRouter from './auth.js';
import userRouter from './user.js';
import chatbotRouter from './chatbot.js';
import notificationRouter from './notification.js';

export default function route(app) {
    app.use('/api/auth', authRouter);
    app.use('/api/users', userRouter);
    app.use('/api/chatbot', chatbotRouter);
    app.use('/api/notification', notificationRouter);
};
