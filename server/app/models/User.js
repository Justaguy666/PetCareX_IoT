import mongoose from "mongoose";

const ScheduleSchema = new mongoose.Schema({
    time: { 
        type: String,
        required: true,
        match: /^([01]\d|2[0-3]):([0-5]\d)$/
    },
    enabled: { type: Boolean, default: true },
}, { _id : false });

const HistorySchema = new mongoose.Schema({
    time: { 
        type: Date,
        default: Date.now,
        required: true
    },
    amount: { 
        type: Number,
        min: 0,
        required: true,
    },
    status: { 
        type: String,
        enum: ['success', 'missed'],
        required: true
    }
}, { _id : false });

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 20,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, "Email không hợp lệ"]
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        select: false
    },
    schedule: {
        type: [ScheduleSchema],
        default: []
    },
    history: {
        type: [HistorySchema],
        default: []
    },
    configurations: {
        is_automatic: { type: Boolean, default: false },
        notifications: {
            feeding: { type: Boolean, default: true },
            lack_of_food: { type: Boolean, default: true },
            lack_of_water: { type: Boolean, default: true },
            feeding_in_next_15_minutes: { type: Boolean, default: false }
        },
        food_amount: {
            type: Number,
            min: 25,
            max: 125,
            default: 75
        }
    }
}, { timestamps: true });

UserSchema.index({ _id: 1, "history.time": -1 });

export default mongoose.model('User', UserSchema);