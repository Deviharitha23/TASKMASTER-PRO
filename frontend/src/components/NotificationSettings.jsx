import React, { useState } from 'react';
import './NotificationSettings.css';

const NotificationSettings = ({ onClose, onSave }) => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    reminderTime: 60, // minutes before due date
    dailyDigest: true,
    digestTime: '08:00',
    overdueReminders: true
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(settings);
  };

  return (
    <div className="notification-settings-overlay">
      <div className="notification-settings-modal">
        <div className="modal-header">
          <h2>Notification Settings</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="settings-section">
            <h3>Email Notifications</h3>
            
            <div className="setting-item">
              <label>
                <input
                  type="checkbox"
                  name="emailNotifications"
                  checked={settings.emailNotifications}
                  onChange={handleChange}
                />
                <span>Enable email notifications</span>
              </label>
            </div>

            <div className="setting-item">
              <label>
                <span>Reminder time before due date</span>
                <select
                  name="reminderTime"
                  value={settings.reminderTime}
                  onChange={handleChange}
                  disabled={!settings.emailNotifications}
                >
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="120">2 hours</option>
                  <option value="1440">1 day</option>
                </select>
              </label>
            </div>
          </div>

          <div className="settings-section">
            <h3>Daily Digest</h3>
            
            <div className="setting-item">
              <label>
                <input
                  type="checkbox"
                  name="dailyDigest"
                  checked={settings.dailyDigest}
                  onChange={handleChange}
                />
                <span>Receive daily task summary</span>
              </label>
            </div>

            <div className="setting-item">
              <label>
                <span>Digest time</span>
                <input
                  type="time"
                  name="digestTime"
                  value={settings.digestTime}
                  onChange={handleChange}
                  disabled={!settings.dailyDigest}
                />
              </label>
            </div>
          </div>

          <div className="settings-section">
            <h3>Other Reminders</h3>
            
            <div className="setting-item">
              <label>
                <input
                  type="checkbox"
                  name="overdueReminders"
                  checked={settings.overdueReminders}
                  onChange={handleChange}
                />
                <span>Notify for overdue tasks</span>
              </label>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-save">
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NotificationSettings;