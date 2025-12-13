import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

import routes from './routes/index.route.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true
}));
app.use(express.json());

// Routes
app.use('/api', routes);

// Connect to MongoDB
const connectDB = async () => {
    try {
        if (process.env.MONGODB_URI) {
            await mongoose.connect(process.env.MONGODB_URI);
            console.log('✅ Connected to MongoDB');
        } else {
            console.log('⚠️ MongoDB URI not provided, running without database');
        }
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
    }
};

connectDB();

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
