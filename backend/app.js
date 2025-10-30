require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const notificationScheduler = require('./services/notificationScheduler');
const { sendDailyDigest } = require('./services/emailService');
const cron = require('node-cron');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/todoapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connected to MongoDB');
  
  // Start notification schedulers
  notificationScheduler.start();
  
  // Daily digest at 8 AM every day
  cron.schedule('0 8 * * *', () => {
    console.log('📧 Sending daily digest emails...');
    sendDailyDigest();
  });
  
  console.log('✅ All schedulers started successfully');
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true,
    message: 'Server is running successfully',
    timestamp: new Date().toISOString()
  });
});

// Test endpoint to manually trigger notifications
app.post('/api/test-notifications', async (req, res) => {
  try {
    await notificationScheduler.triggerManualCheck();
    res.json({ 
      success: true,
      message: 'Manual notification check completed' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ 
    success: false,
    message: 'Internal server error' 
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false,
    message: 'API endpoint not found' 
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 API available at http://localhost:${PORT}/api`);
});