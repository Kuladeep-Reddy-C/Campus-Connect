// backend/EventsModule/Models/Event.js
import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Event description is required']
  },
  category: {
    type: String,
    required: [true, 'Event category is required'],
    enum: ['Academic', 'Technical', 'Sports', 'Cultural', 'Other'],
    default: 'Other'
  },
  date: {
    type: Date,
    required: [true, 'Event date is required']
  },
  location: {
    type: String,
    required: [true, 'Event location is required'],
    trim: true,
    maxlength: [150, 'Location cannot be more than 150 characters']
  },
  qrCode: { // Storing a URL or identifier for the QR code image/data for the event itself
    type: String,
    default: ''
  },
  trendingScore: {
    type: Number,
    default: 0,
    min: 0
  },
  // --- NEW FIELD FOR IMAGE URL ---
  imageUrl: {
    type: String,
    default: '' // Or null, depending on your preference
  },
  // --- END NEW FIELD ---
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

export default mongoose.model('Event', EventSchema);