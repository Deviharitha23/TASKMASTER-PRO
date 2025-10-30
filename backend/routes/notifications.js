const express = require('express');
const router = express.Router();
const { sendTaskNotification } = require('../services/emailService');
const Task = require('../models/Task');
const auth = require('../middleware/auth');

// Send manual notification for a specific task
router.post('/send/:taskId', auth, async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.taskId,
      userId: req.user.id
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const result = await sendTaskNotification(req.user.email, task);

    if (result.success) {
      res.json({ message: 'Notification sent successfully' });
    } else {
      res.status(500).json({ message: 'Failed to send notification', error: result.error });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Test notification endpoint
router.post('/test', auth, async (req, res) => {
  try {
    const testTask = {
      title: 'Test Notification',
      description: 'This is a test notification',
      dueDate: new Date(),
      status: 'pending'
    };

    const result = await sendTaskNotification(req.user.email, testTask);

    if (result.success) {
      res.json({ message: 'Test notification sent successfully' });
    } else {
      res.status(500).json({ message: 'Failed to send test notification', error: result.error });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;