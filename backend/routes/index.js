import authRouter from './auth.js';
//import userRoutes from './user.route.js';

export default function route(app) {
    app.use('/api/auth', authRouter);
    app.use('/', (req, res) => {
        return res.json({message: "Hello"});
    });
};
