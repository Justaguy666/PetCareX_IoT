import mongoose from 'mongoose';

async function connect() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, { 
            autoIndex: true 
        });

        console.log('Database connect successfully');
    } catch (e) {
        console.log('Failed to connect database:', e.message);
    }
}

export default connect;
