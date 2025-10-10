// backend/EventsModule/Models/User.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  clerkUserId: {
    type: String,
    required: [true, 'Clerk User ID is required'],
    unique: true, // Ensure each Clerk user has only one local User record
    index: true // For efficient lookups
  },
  // You can add other user-related fields here if needed,
  // e.g., name, email, roles, profile picture URL, etc.
  // These could be populated from Clerk webhooks or user profile updates.
  email: {
    type: String,
    // required: [true, 'Email is required'], // Only if you ensure this on creation
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please fill a valid email address'
    ]
  },
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  // Example for roles (for your RBAC later)
  role: {
    type: String,
    enum: ['user', 'moderator', 'admin'],
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Check if the 'User' model already exists before compiling it
// This prevents the OverwriteModelError during hot-reloads (like with Nodemon)
// or if the model is accidentally imported/compiled multiple times.
const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;