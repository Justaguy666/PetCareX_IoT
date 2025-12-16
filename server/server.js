import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import route from './routes/index.js';
import db from './config/db.js'
import cookieParser from 'cookie-parser';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3001'],
    credentials: true
}));
app.use(express.json());

// Cookie
app.use(cookieParser());

// Routes
route(app);

// Database
db();

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
