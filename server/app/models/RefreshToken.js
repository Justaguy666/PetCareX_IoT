import mongoose from "mongoose";

const RefreshTokenSchema = new mongoose.Schema({
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true, 
      index: true 
    },
    refreshId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    expiredAt: {
      type: Date,
      required: true,
      index: true
    }
}, { timestamps: true });  

export default mongoose.model('RefreshToken', RefreshTokenSchema);