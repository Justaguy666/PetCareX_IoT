import mongoose from 'mongoose';

async function connect() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, { 
            autoIndex: false 
        });
        console.log('Connect successfully');
    } catch (e) {
        console.log('Failed to connect database');
    }
}

export default connect;
