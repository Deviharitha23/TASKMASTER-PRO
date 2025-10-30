const Task = require('../models/Task');
const { sendEmail } = require('../utils/emailService');

// Check for upcoming tasks and send reminders
const checkTaskReminders = async () => {
  try {
    console.log('🔔 Checking for task reminders...');
    
    const now = new Date();
    const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
    const twentyFourHoursFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    // Find tasks due within 1 hour (urgent)
    const urgentTasks = await Task.find({
      dueDate: { 
        $gte: now, 
        $lte: oneHourFromNow 
      },
      status: { $in: ['pending', 'inProgress'] },
      completed: false
    }).populate('user', 'name email emailNotifications taskReminders');

    // Find tasks due within 24 hours
    const upcomingTasks = await Task.find({
      dueDate: { 
        $gte: oneHourFromNow, 
        $lte: twentyFourHoursFromNow 
      },
      status: { $in: ['pending', 'inProgress'] },
      completed: false
    }).populate('user', 'name email emailNotifications taskReminders');

    let sentCount = 0;

    // Send urgent reminders (1 hour)
    for (const task of urgentTasks) {
      if (task.user.emailNotifications && task.user.taskReminders) {
        try {
          await sendEmail(
            task.user.email, 
            'taskReminder', 
            { 
              task: {
                title: task.title,
                description: task.description,
                priority: task.priority,
                userName: task.user.name
              },
              hoursRemaining: 1
            }
          );
          sentCount++;
        } catch (error) {
          console.log(`Failed to send urgent reminder for task ${task._id}:`, error);
        }
      }
    }

    // Send upcoming reminders (24 hours)
    for (const task of upcomingTasks) {
      if (task.user.emailNotifications && task.user.taskReminders) {
        try {
          await sendEmail(
            task.user.email, 
            'taskReminder', 
            { 
              task: {
                title: task.title,
                description: task.description,
                priority: task.priority,
                userName: task.user.name
              },
              hoursRemaining: 24
            }
          );
          sentCount++;
        } catch (error) {
          console.log(`Failed to send upcoming reminder for task ${task._id}:`, error);
        }
      }
    }

    console.log(`✅ Sent ${sentCount} task reminders via SendGrid`);
    return { success: true, sentCount };

  } catch (error) {
    console.error('❌ Error in task reminder service:', error);
    return { success: false, error: error.message };
  }
};

// Send task completion email
const sendTaskCompletionEmail = async (taskId) => {
  try {
    const task = await Task.findById(taskId).populate('user', 'name email emailNotifications');
    
    if (task && task.user.emailNotifications) {
      await sendEmail(
        task.user.email,
        'taskCompleted',
        {
          task: {
            title: task.title,
            description: task.description,
            userName: task.user.name
          }
        }
      );
      console.log(`✅ Task completion email sent for: ${task.title}`);
    }
  } catch (error) {
    console.error('❌ Error sending task completion email:', error);
  }
};

module.exports = {
  checkTaskReminders,
  sendTaskCompletionEmail
};