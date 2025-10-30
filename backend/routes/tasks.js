const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  dueDate: {
    type: Date,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  notificationSent: {
    type: Boolean,
    default: false
  },
  reminderTime: {
    type: Number, // Minutes before due date
    default: 60 // 1 hour before
  },
  emailNotification: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
taskSchema.index({ userId: 1, status: 1 });
taskSchema.index({ dueDate: 1, status: 1 });

module.exports = mongoose.model('Task', taskSchema);