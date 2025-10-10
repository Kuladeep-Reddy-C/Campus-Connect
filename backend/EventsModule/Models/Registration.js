// backend/EventsModule/Models/Registration.js
import mongoose from 'mongoose';

const RegistrationSchema = new mongoose.Schema({
  user: { // Reference to our local User model, which contains clerkUserId
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required for registration']
  },
  event: {
    type: mongoose.Schema.ObjectId,
    ref: 'Event',
    required: [true, 'Event ID is required for registration']
  },
  registeredAt: {
    type: Date,
    default: Date.now
  },
  checkInStatus: {
    type: Boolean,
    default: false
  },
  qrCodeData: { // Data encoded in the QR code for this specific registration
    type: String,
    required: [true, 'QR code data is required for registration']
  }
});

// Ensure a user can only register for an event once
RegistrationSchema.index({ user: 1, event: 1 }, { unique: true });

export default mongoose.model('Registration', RegistrationSchema);