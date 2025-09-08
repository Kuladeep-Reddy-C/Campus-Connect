// models/user.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },          // User ID from Clerk  
    fullName: { type: String, required: false },
    emailAddress: { type: String, required: false },
    imageUrl: { type: String, required: false }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
