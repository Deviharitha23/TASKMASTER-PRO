const sgMail = require('@sendgrid/mail');

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  console.log('✅ Twilio SendGrid initialized');
} else {
  console.log('⚠  SendGrid API key not configured');
}

// Email templates
const emailTemplates = {
  welcome: (userName) => ({
    subject: 'Welcome to TaskMaster Pro! 🚀',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 0; background: #f8f9fa; }
          .container { max-width: 600px; margin: 0 auto; background: white; }
          .header { background: linear-gradient(135deg, #667eea, #764ba2); padding: 2rem; text-align: center; color: white; }
          .content { padding: 2rem; }
          .button { background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; }
          .footer { background: #2d3748; color: white; padding: 1rem; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">Welcome to TaskMaster Pro! 🎉</h1>
          </div>
          <div class="content">
            <h2>Hello ${userName},</h2>
            <p>We're excited to have you on board! TaskMaster Pro will help you:</p>
            <ul>
              <li>✅ Organize your tasks efficiently</li>
              <li>✅ Set priorities and due dates</li>
              <li>✅ Track your productivity</li>
              <li>✅ Get timely reminders</li>
            </ul>
            <p>Start by creating your first task and experience the power of organized productivity!</p>
            <div style="text-align: center; margin: 2rem 0;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard" class="button">
                Go to Dashboard
              </a>
            </div>
          </div>
          <div class="footer">
            <p>Happy Tasking!<br>The TaskMaster Pro Team</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: Welcome to TaskMaster Pro, ${userName}! We're excited to have you on board. Start organizing your tasks at: ${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard
  }),

  taskReminder: (task, hoursRemaining) => ({
    subject: 🔔 Reminder: "${task.title}" due soon!,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 0; background: #f8f9fa; }
          .container { max-width: 600px; margin: 0 auto; background: white; }
          .header { background: #ed8936; padding: 2rem; text-align: center; color: white; }
          .content { padding: 2rem; }
          .task-card { background: white; padding: 1.5rem; border-radius: 8px; border-left: 4px solid #ed8936; margin: 1rem 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .button { background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; }
          .priority { background: ${task.priority === 'high' ? '#f56565' : task.priority === 'medium' ? '#ed8936' : '#48bb78'}; color: white; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.8rem; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">Task Reminder ⏰</h1>
          </div>
          <div class="content">
            <h2>Hello ${task.userName},</h2>
            <p>This is a friendly reminder about your upcoming task:</p>
            <div class="task-card">
              <h3 style="margin: 0 0 0.5rem 0; color: #2d3748;">${task.title}</h3>
              <p style="margin: 0.5rem 0; color: #718096;">${task.description}</p>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1rem;">
                <span class="priority">${task.priority} priority</span>
                <span style="color: #e53e3e; font-weight: bold;">Due in ${hoursRemaining} hours</span>
              </div>
            </div>
            <p>Don't forget to complete your task on time!</p>
            <div style="text-align: center; margin: 2rem 0;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard" class="button">
                View Task
              </a>
            </div>
          </div>
          <div style="background: #2d3748; color: white; padding: 1rem; text-align: center;">
            <p>Stay productive!<br>The TaskMaster Pro Team</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: Task Reminder: "${task.title}" is due in ${hoursRemaining} hours. Description: ${task.description}. Priority: ${task.priority}. View it at: ${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard
  }),

  taskCompleted: (task) => ({
    subject: '🎉 Task Completed! Great Job!',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 0; background: #f8f9fa; }
          .container { max-width: 600px; margin: 0 auto; background: white; }
          .header { background: #48bb78; padding: 2rem; text-align: center; color: white; }
          .content { padding: 2rem; }
          .task-card { background: white; padding: 1.5rem; border-radius: 8px; border-left: 4px solid #48bb78; margin: 1rem 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .button { background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; }
          .completed-badge { background: #48bb78; color: white; padding: 0.5rem 1rem; border-radius: 20px; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">Task Completed! 🎊</h1>
          </div>
          <div class="content">
            <h2>Congratulations, ${task.userName}! 🎉</h2>
            <p>You've successfully completed the task:</p>
            <div class="task-card">
              <h3 style="margin: 0 0 0.5rem 0; color: #2d3748;">${task.title}</h3>
              <p style="margin: 0.5rem 0; color: #718096;">${task.description}</p>
              <div style="text-align: center; margin-top: 1rem;">
                <span class="completed-badge">✅ COMPLETED</span>
              </div>
            </div>
            <p>Keep up the great work! Your productivity is improving.</p>
            <div style="text-align: center; margin: 2rem 0;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard" class="button">
                Continue Working
              </a>
            </div>
          </div>
          <div style="background: #2d3748; color: white; padding: 1rem; text-align: center;">
            <p>Keep achieving!<br>The TaskMaster Pro Team</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: Congratulations! You've completed the task: "${task.title}". Great job! Continue being productive at: ${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard
  }),

  passwordReset: (resetLink) => ({
    subject: '🔐 Password Reset Request - TaskMaster Pro',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 0; background: #f8f9fa; }
          .container { max-width: 600px; margin: 0 auto; background: white; }
          .header { background: #667eea; padding: 2rem; text-align: center; color: white; }
          .content { padding: 2rem; }
          .button { background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; }
          .warning { background: #fffaf0; border: 1px solid #ed8936; padding: 1rem; border-radius: 8px; margin: 1rem 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">Password Reset</h1>
          </div>
          <div class="content">
            <h2>Hello,</h2>
            <p>We received a request to reset your password for your TaskMaster Pro account.</p>
            <div style="text-align: center; margin: 2rem 0;">
              <a href="${resetLink}" class="button">
                Reset Your Password
              </a>
            </div>
            <div class="warning">
              <p><strong>Note:</strong> This link will expire in 1 hour for security reasons.</p>
              <p>If you didn't request this reset, please ignore this email.</p>
            </div>
          </div>
          <div style="background: #2d3748; color: white; padding: 1rem; text-align: center;">
            <p>The TaskMaster Pro Team</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: Password Reset Request: Click the following link to reset your password: ${resetLink}. This link expires in 1 hour.
  })
};

// Send email function
const sendEmail = async (to, templateName, data) => {
  try {
    if (!process.env.SENDGRID_API_KEY) {
      console.log('📧 SendGrid not configured. Skipping email to:', to);
      return { success: false, message: 'SendGrid not configured' };
    }

    const template = emailTemplates[templateName];
    if (!template) {
      throw new Error(Email template '${templateName}' not found);
    }

    const emailContent = typeof template === 'function' ? template(data) : template;

    const msg = {
      to: to,
      from: {
        email: process.env.SENDGRID_FROM_EMAIL || 'noreply@taskmasterpro.com',
        name: process.env.SENDGRID_FROM_NAME || 'TaskMaster Pro'
      },
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text
    };

    const result = await sgMail.send(msg);
    console.log(✅ Email sent to ${to}: ${templateName});
    return { 
      success: true, 
      messageId: result[0]?.headers['x-message-id'],
      statusCode: result[0]?.statusCode
    };
  } catch (error) {
    console.error('❌ Error sending email with SendGrid:', error);
    
    // Log detailed error information
    if (error.response) {
      console.error('SendGrid error details:', error.response.body);
    }
    
    return { 
      success: false, 
      error: error.message,
      details: error.response?.body 
    };
  }
};

// Test email function
const sendTestEmail = async (to) => {
  return await sendEmail(to, 'welcome', { userName: 'Test User' });
};

module.exports = {
  sendEmail,
  sendTestEmail,
  emailTemplates
};