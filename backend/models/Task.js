const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  completed: {
    type: Boolean,
    default: false
  },
  dueDate: {
    type: Date,
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  notificationsSent: {
    twentyFourHours: { type: Boolean, default: false },
    oneHour: { type: Boolean, default: false }
  }
}, {
  timestamps: true
});

// Check if model already exists before defining it
const Task = mongoose.models.Task || mongoose.model('Task', taskSchema);
module.exports = Task;