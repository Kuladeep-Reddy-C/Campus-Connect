import mongoose from 'mongoose';

const teamJoinFormSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  role: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  motivation: {
    type: String,
    required: true,
    minlength: 20
  },
  availability: {
    type: String,
    enum: ['full-time', 'part-time', 'weekend', 'flexible'],
    required: true
  },
  experience: {
    type: String,
    required: true,
    minlength: 10
  },
  joinedAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
});

const TeamJoinForm = mongoose.model('TeamJoinForm', teamJoinFormSchema);

export default TeamJoinForm;