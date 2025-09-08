import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  adminEmail: {
    type:String,
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    minlength: [5, 'Title must be at least 5 characters'],
    maxlength: [100, 'Title must be less than 100 characters'],
    trim: true
  },
  domain: {
    type: String,
    required: [true, 'Domain is required'],
    enum: {
      values: [
        'Web Development',
        'Data Science',
        'Mobile Development',
        'IoT',
        'AI/ML',
        'Cybersecurity',
        'Game Development',
        'DevOps'
      ],
      message: 'Invalid domain value'
    }
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    minlength: [20, 'Description must be at least 20 characters'],
    trim: true
  },
  teamSize: {
    type: Number,
    required: [true, 'Team size is required'],
    min: [1, 'Team size must be at least 1'],
    max: [10, 'Team size cannot exceed 10']
  },
  skills: {
    type: [String],
    required: [true, 'At least one skill is required'],
    validate: {
      validator: function(arr) {
        return arr.length > 0;
      },
      message: 'At least one skill is required'
    }
  },
  createdBy: {
    type: String,
    required: [true, 'Creator ID is required'],
    trim: true
  },
  leaderName: {
    type: String,
    required: [true, 'Leader name is required'],
    trim: true
  },
  currentMembers: {
    type: Number,
    default: 1,
    min: [1, 'At least one member is required']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: {
      values: ['active', 'inactive', 'completed'],
      message: 'Invalid status value'
    },
    default: 'active'
  }
}, {
  timestamps: true
});

export default mongoose.model('Project', projectSchema);