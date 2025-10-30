import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AddTask = ({ token, user }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [duration, setDuration] = useState(60);
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('12:00');
  const [reminder, setReminder] = useState(false);
  const [reminderTimings, setReminderTimings] = useState({
    fiveMinutes: false,
    oneHour: false,
    oneDay: false,
    custom: false,
    customTime: ''
  });
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isCollaborative, setIsCollaborative] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('basic'); // 'basic', 'collaboration', 'notifications'
  const navigate = useNavigate();

  // Enhanced Professional Internal CSS Styles with Modern Design
  const styles = {
    // Main container with animated background
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      minHeight: '100vh',
      padding: '40px 20px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      position: 'relative',
      overflow: 'hidden',
    },
    
    // Background elements
    backgroundOrb1: {
      position: 'absolute',
      top: '10%',
      left: '5%',
      width: '300px',
      height: '300px',
      background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%)',
      borderRadius: '50%',
      animation: 'float 6s ease-in-out infinite'
    },
    backgroundOrb2: {
      position: 'absolute',
      top: '60%',
      right: '8%',
      width: '200px',
      height: '200px',
      background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)',
      borderRadius: '50%',
      animation: 'float 8s ease-in-out infinite 1s'
    },
    backgroundOrb3: {
      position: 'absolute',
      bottom: '15%',
      left: '15%',
      width: '150px',
      height: '150px',
      background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%)',
      borderRadius: '50%',
      animation: 'float 10s ease-in-out infinite 2s'
    },
    
    // Glass morphism wrapper
    wrapper: {
      background: 'rgba(255, 255, 255, 0.97)',
      backdropFilter: 'blur(25px)',
      padding: '40px',
      borderRadius: '28px',
      boxShadow: `
        0 32px 64px -12px rgba(0, 0, 0, 0.25),
        0 0 0 1px rgba(255, 255, 255, 0.15),
        inset 0 1px 0 rgba(255, 255, 255, 0.2)
      `,
      width: '100%',
      maxWidth: '800px',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      position: 'relative',
      zIndex: 10,
    },
    
    // Header section
    header: {
      textAlign: 'center',
      marginBottom: '40px',
      position: 'relative',
    },
    heading: {
      color: '#1a202c',
      fontWeight: '900',
      fontSize: '42px',
      marginBottom: '12px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      letterSpacing: '-0.5px',
    },
    subheading: {
      color: '#718096',
      fontSize: '18px',
      fontWeight: '500',
      lineHeight: '1.6',
    },
    
    // Navigation Tabs
    tabs: {
      display: 'flex',
      background: 'rgba(248, 250, 252, 0.8)',
      borderRadius: '16px',
      padding: '8px',
      marginBottom: '32px',
      border: '1px solid rgba(226, 232, 240, 0.6)',
    },
    tab: {
      flex: 1,
      padding: '16px 24px',
      background: 'transparent',
      border: 'none',
      borderRadius: '12px',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      color: '#718096',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
    },
    tabActive: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
      transform: 'translateY(-2px)',
    },
    
    // Form elements
    formGroup: {
      marginBottom: '32px',
      position: 'relative',
    },
    label: {
      display: 'block',
      marginBottom: '12px',
      fontWeight: '700',
      color: '#2d3748',
      fontSize: '15px',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    required: {
      color: '#e53e3e',
      marginLeft: '4px',
    },
    input: {
      width: '100%',
      padding: '18px 22px',
      border: '2px solid #e2e8f0',
      borderRadius: '14px',
      fontSize: '16px',
      fontFamily: 'inherit',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      background: 'rgba(255, 255, 255, 0.9)',
      color: '#1a202c',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)',
    },
    inputFocus: {
      outline: 'none',
      borderColor: '#667eea',
      boxShadow: '0 0 0 4px rgba(102, 126, 234, 0.15), 0 4px 20px rgba(102, 126, 234, 0.1)',
      background: 'rgba(255, 255, 255, 0.95)',
      transform: 'translateY(-2px)',
    },
    textarea: {
      width: '100%',
      padding: '18px 22px',
      border: '2px solid #e2e8f0',
      borderRadius: '14px',
      fontSize: '16px',
      fontFamily: 'inherit',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      resize: 'vertical',
      minHeight: '140px',
      background: 'rgba(255, 255, 255, 0.9)',
      lineHeight: '1.6',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)',
    },
    select: {
      width: '100%',
      padding: '18px 22px',
      border: '2px solid #e2e8f0',
      borderRadius: '14px',
      fontSize: '16px',
      fontFamily: 'inherit',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      background: 'rgba(255, 255, 255, 0.9)',
      appearance: 'none',
      backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 5'><path fill='%23666' d='M2 0L0 2h4zm0 5L0 3h4z'/></svg>")`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'right 22px center',
      backgroundSize: '10px 12px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)',
    },
    
    // Form layout
    formRow: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '24px',
      alignItems: 'flex-start',
    },
    formRowGroup: {
      display: 'flex',
      flexDirection: 'column',
    },
    
    // Checkbox styling
    checkboxContainer: {
      display: 'flex',
      alignItems: 'flex-start',
      cursor: 'pointer',
      fontWeight: '500',
      color: '#2d3748',
      padding: '16px 0',
      transition: 'all 0.3s ease',
      background: 'transparent',
      borderRadius: '12px',
      padding: '16px',
    },
    checkboxContainerHover: {
      background: 'rgba(102, 126, 234, 0.05)',
      transform: 'translateX(8px)',
    },
    checkbox: {
      marginRight: '16px',
      transform: 'scale(1.4)',
      accentColor: '#667eea',
      marginTop: '2px',
    },
    
    // Priority indicator
    priorityIndicator: {
      display: 'inline-block',
      width: '14px',
      height: '14px',
      borderRadius: '50%',
      marginRight: '10px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    },
    priorityLow: { backgroundColor: '#38a169' },
    priorityMedium: { backgroundColor: '#3182ce' },
    priorityHigh: { backgroundColor: '#e53e3e' },
    
    // Collaboration Toggle
    collaborationToggle: {
      background: 'rgba(248, 250, 252, 0.9)',
      border: '2px solid #e2e8f0',
      borderRadius: '16px',
      padding: '24px',
      marginBottom: '32px',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
    },
    collaborationToggleActive: {
      borderColor: '#667eea',
      background: 'rgba(102, 126, 234, 0.08)',
      boxShadow: '0 8px 30px rgba(102, 126, 234, 0.15)',
    },
    toggleHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '16px',
    },
    toggleLabel: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      fontWeight: '700',
      color: '#2d3748',
      fontSize: '18px',
    },
    toggleSwitch: {
      position: 'relative',
      display: 'inline-block',
      width: '60px',
      height: '32px',
    },
    toggleSlider: {
      position: 'absolute',
      cursor: 'pointer',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
      backgroundColor: '#cbd5e0',
      transition: '0.4s',
      borderRadius: '34px',
      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)',
    },
    toggleSliderBefore: {
      position: 'absolute',
      content: '""',
      height: '24px',
      width: '24px',
      left: '4px',
      bottom: '4px',
      backgroundColor: 'white',
      transition: '0.4s',
      borderRadius: '50%',
      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
    },
    toggleChecked: {
      backgroundColor: '#667eea',
    },
    toggleCheckedBefore: {
      transform: 'translateX(28px)',
    },
    
    // User assignment section
    userAssignment: {
      border: '2px solid #e2e8f0',
      borderRadius: '16px',
      padding: '24px',
      background: 'rgba(248, 250, 252, 0.9)',
      marginBottom: '32px',
      transition: 'all 0.3s ease',
      maxHeight: isCollaborative ? '500px' : '0',
      overflow: 'hidden',
      opacity: isCollaborative ? 1 : 0,
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
    },
    userSearch: {
      width: '100%',
      padding: '14px 18px',
      border: '2px solid #e2e8f0',
      borderRadius: '12px',
      fontSize: '15px',
      marginBottom: '18px',
      background: 'white',
      transition: 'all 0.3s ease',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
    },
    userList: {
      maxHeight: '180px',
      overflowY: 'auto',
      marginTop: '18px',
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      background: 'white',
      boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
    },
    userItem: {
      padding: '16px 20px',
      borderBottom: '1px solid #f1f5f9',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    userItemHover: {
      backgroundColor: '#f8fafc',
      transform: 'translateX(4px)',
    },
    userItemSelected: {
      backgroundColor: '#667eea',
      color: 'white',
    },
    assignedUsers: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '10px',
      marginTop: '16px',
    },
    assignedUserTag: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '8px 16px',
      borderRadius: '20px',
      fontSize: '13px',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
    },
    removeUserBtn: {
      background: 'rgba(255, 255, 255, 0.3)',
      border: 'none',
      borderRadius: '50%',
      width: '20px',
      height: '20px',
      color: 'white',
      cursor: 'pointer',
      fontSize: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s ease',
    },
    
    // Enhanced Notification Settings Section
    notificationSection: {
      background: 'rgba(248, 250, 252, 0.9)',
      border: '2px solid #e2e8f0',
      borderRadius: '16px',
      padding: '24px',
      marginBottom: '32px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
    },
    notificationHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '20px',
    },
    reminderOptionsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '16px',
      marginBottom: '20px',
    },
    reminderOption: {
      background: 'white',
      border: '2px solid #e2e8f0',
      borderRadius: '14px',
      padding: '20px',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      textAlign: 'center',
      boxShadow: '0 2px 12px rgba(0, 0, 0, 0.05)',
    },
    reminderOptionSelected: {
      borderColor: '#667eea',
      backgroundColor: 'rgba(102, 126, 234, 0.08)',
      transform: 'translateY(-4px)',
      boxShadow: '0 8px 25px rgba(102, 126, 234, 0.15)',
    },
    reminderIcon: {
      fontSize: '32px',
      marginBottom: '12px',
      display: 'block',
    },
    reminderTitle: {
      fontSize: '16px',
      fontWeight: '700',
      color: '#2d3748',
      marginBottom: '8px',
    },
    reminderDescription: {
      fontSize: '13px',
      color: '#718096',
      lineHeight: '1.4',
    },
    customReminderInput: {
      width: '100%',
      padding: '14px 18px',
      border: '2px solid #e2e8f0',
      borderRadius: '12px',
      fontSize: '15px',
      background: 'white',
      marginTop: '12px',
      transition: 'all 0.3s ease',
    },
    
    // Buttons
    formActions: {
      display: 'flex',
      gap: '20px',
      marginTop: '40px',
    },
    btnPrimary: {
      flex: 1,
      padding: '20px 28px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '16px',
      fontSize: '17px',
      fontWeight: '800',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: '0 8px 30px rgba(102, 126, 234, 0.4)',
      letterSpacing: '0.5px',
      textTransform: 'uppercase',
      position: 'relative',
      overflow: 'hidden',
    },
    btnPrimaryHover: {
      transform: 'translateY(-4px)',
      boxShadow: '0 15px 40px rgba(102, 126, 234, 0.5)',
    },
    btnSecondary: {
      flex: 1,
      padding: '20px 28px',
      background: 'rgba(255, 255, 255, 0.9)',
      color: '#667eea',
      border: '2px solid #667eea',
      borderRadius: '16px',
      fontSize: '17px',
      fontWeight: '800',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      letterSpacing: '0.5px',
      textTransform: 'uppercase',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 4px 20px rgba(102, 126, 234, 0.1)',
    },
    btnSecondaryHover: {
      background: '#667eea',
      color: 'white',
      transform: 'translateY(-4px)',
      boxShadow: '0 8px 30px rgba(102, 126, 234, 0.3)',
    },
    btnDisabled: {
      background: '#cbd5e0',
      transform: 'none',
      boxShadow: 'none',
      cursor: 'not-allowed',
      opacity: '0.6',
    },
    
    // Error message
    errorMessage: {
      backgroundColor: 'rgba(254, 215, 215, 0.95)',
      color: '#742a2a',
      padding: '24px',
      borderRadius: '16px',
      marginBottom: '28px',
      borderLeft: '6px solid #e53e3e',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 8px 25px rgba(229, 62, 62, 0.15)',
    },
    errorActions: {
      marginTop: '20px',
      display: 'flex',
      gap: '16px',
    },
    
    // Loading animation
    loadingSpinner: {
      display: 'inline-block',
      width: '22px',
      height: '22px',
      border: '3px solid transparent',
      borderTop: '3px solid currentColor',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      marginRight: '10px',
    },
    
    // Success state
    successState: {
      opacity: '0.7',
      pointerEvents: 'none',
    },
    
    // Icon styles
    icon: {
      marginRight: '10px',
      fontSize: '20px',
    },

    // Feature badges
    featureBadge: {
      background: 'linear-gradient(135deg, #68d391, #48bb78)',
      color: 'white',
      padding: '6px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '700',
      marginLeft: '10px',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
  };

  // Set default due date to tomorrow
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const formattedDate = tomorrow.toISOString().split('T')[0];
    setDueDate(formattedDate);
  }, []);

  // Check if token is available
  useEffect(() => {
    if (!token) {
      setError('Authentication token missing. Please login again.');
    }
  }, [token]);

  // Fetch available users for assignment
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          const validUsers = (data.users || []).filter(user => 
            user && user._id && user.username && user.email
          );
          setAvailableUsers(validUsers);
        } else {
          setAvailableUsers([
            { _id: '1', username: 'john_doe', email: 'john@example.com' },
            { _id: '2', username: 'jane_smith', email: 'jane@example.com' },
            { _id: '3', username: 'mike_wilson', email: 'mike@example.com' },
            { _id: '4', username: 'sarah_jones', email: 'sarah@example.com' },
          ]);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        setAvailableUsers([
          { _id: '1', username: 'john_doe', email: 'john@example.com' },
          { _id: '2', username: 'jane_smith', email: 'jane@example.com' },
          { _id: '3', username: 'mike_wilson', email: 'mike@example.com' },
        ]);
      }
    };

    if (token) {
      fetchUsers();
    }
  }, [token]);

  const handleUserSelect = (user) => {
    if (user && user._id && !assignedUsers.find(u => u && u._id === user._id)) {
      setAssignedUsers([...assignedUsers, user]);
    }
  };

  const handleUserRemove = (userId) => {
    setAssignedUsers(assignedUsers.filter(user => user && user._id !== userId));
  };

  // FIXED: Added proper null checks to prevent toLowerCase() error
  const filteredUsers = availableUsers.filter(user => {
    if (!user) return false;
    
    const username = user.username || '';
    const email = user.email || '';
    const searchTermLower = (searchTerm || '').toLowerCase();
    
    return username.toLowerCase().includes(searchTermLower) ||
           email.toLowerCase().includes(searchTermLower);
  });

  // Handle reminder timing changes
  const handleReminderTimingChange = (timing) => {
    setReminderTimings(prev => ({
      ...prev,
      [timing]: !prev[timing]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!token) {
      setError('You are not authenticated. Please login again.');
      navigate('/login');
      return;
    }

    // Validate due date
    if (!dueDate) {
      setError('Due date is required');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const dueDateTime = new Date(`${dueDate}T${dueTime}`);
      
      // Calculate reminder times based on selections
      const reminderTimes = [];
      if (reminderTimings.fiveMinutes) {
        reminderTimes.push('5min');
      }
      if (reminderTimings.oneHour) {
        reminderTimes.push('1hour');
      }
      if (reminderTimings.oneDay) {
        reminderTimes.push('1day');
      }
      if (reminderTimings.custom && reminderTimings.customTime) {
        reminderTimes.push(reminderTimings.customTime);
      }

      const taskData = {
        title,
        description,
        priority,
        duration: parseInt(duration),
        dueDate: dueDateTime.toISOString(),
        assignedUsers: assignedUsers.filter(user => user && user._id).map(user => user._id),
        isCollaborative,
        emailNotifications: reminder,
        taskReminders: reminder,
        reminderTimes,
        notificationSettings: {
          email: reminder,
          push: true,
          sms: false
        }
      };

      console.log('Sending task data:', taskData);

      const response = await fetch('http://localhost:5000/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(taskData)
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`Server returned HTML instead of JSON. Status: ${response.status}`);
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      if (data.success) {
        // Success - show brief success state before redirect
        setTimeout(() => {
          navigate('/dashboard');
        }, 500);
      } else {
        setError(data.message || 'Failed to create task');
      }
    } catch (error) {
      console.error('Error creating task:', error);
      setError(`Error: ${error.message}. Please check if the server is running.`);
    } finally {
      setIsLoading(false);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Helper functions for interactive effects
  const handleMouseEnter = (e, type) => {
    if (isLoading) return;
    const btn = e.target;
    if (type === 'primary') {
      btn.style.transform = styles.btnPrimaryHover.transform;
      btn.style.boxShadow = styles.btnPrimaryHover.boxShadow;
    } else if (type === 'secondary') {
      btn.style.transform = styles.btnSecondaryHover.transform;
      btn.style.background = styles.btnSecondaryHover.background;
      btn.style.color = styles.btnSecondaryHover.color;
      btn.style.boxShadow = styles.btnSecondaryHover.boxShadow;
    }
  };

  const handleMouseLeave = (e, type) => {
    if (isLoading) return;
    const btn = e.target;
    if (type === 'primary') {
      btn.style.transform = 'none';
      btn.style.boxShadow = styles.btnPrimary.boxShadow;
    } else if (type === 'secondary') {
      btn.style.transform = 'none';
      btn.style.background = styles.btnSecondary.background;
      btn.style.color = styles.btnSecondary.color;
      btn.style.boxShadow = 'none';
    }
  };

  const handleFocus = (e) => {
    e.target.style.outline = styles.inputFocus.outline;
    e.target.style.borderColor = styles.inputFocus.borderColor;
    e.target.style.boxShadow = styles.inputFocus.boxShadow;
    e.target.style.background = styles.inputFocus.background;
    e.target.style.transform = styles.inputFocus.transform;
  };

  const handleBlur = (e) => {
    e.target.style.outline = 'none';
    e.target.style.borderColor = '#e2e8f0';
    e.target.style.boxShadow = 'none';
    e.target.style.background = 'rgba(255, 255, 255, 0.9)';
    e.target.style.transform = 'none';
  };

  // Tab content rendering
  const renderTabContent = () => {
    switch (activeTab) {
      case 'basic':
        return (
          <>
            <div style={styles.formGroup}>
              <label htmlFor="title" style={styles.label}>
                📝 Task Title <span style={styles.required}>*</span>
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="What needs to be done? Be specific and clear..."
                disabled={isLoading}
                style={styles.input}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="description" style={styles.label}>
                📋 Description
                <span style={styles.featureBadge}>Optional</span>
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add details, notes, context, or specific requirements for this task..."
                disabled={isLoading}
                style={styles.textarea}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>

            <div style={styles.formRow}>
              <div style={styles.formRowGroup}>
                <div style={styles.formGroup}>
                  <label htmlFor="priority" style={styles.label}>
                    <span style={{ 
                      ...styles.priorityIndicator, 
                      ...(priority === 'low' ? styles.priorityLow : 
                           priority === 'medium' ? styles.priorityMedium : 
                           styles.priorityHigh) 
                    }}></span>
                    🎯 Priority Level
                  </label>
                  <select
                    id="priority"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    disabled={isLoading}
                    style={styles.select}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  >
                    <option value="low">🟢 Low Priority - Flexible timeline</option>
                    <option value="medium">🟡 Medium Priority - Important but not urgent</option>
                    <option value="high">🔴 High Priority - Urgent and important</option>
                  </select>
                </div>
              </div>

              <div style={styles.formRowGroup}>
                <div style={styles.formGroup}>
                  <label htmlFor="duration" style={styles.label}>
                    ⏱️ Duration <span style={styles.required}>*</span>
                  </label>
                  <input
                    type="number"
                    id="duration"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    min="1"
                    max="480"
                    required
                    placeholder="Minutes required"
                    disabled={isLoading}
                    style={styles.input}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                </div>
              </div>
            </div>

            <div style={styles.formRow}>
              <div style={styles.formRowGroup}>
                <div style={styles.formGroup}>
                  <label htmlFor="dueDate" style={styles.label}>
                    📅 Due Date <span style={styles.required}>*</span>
                  </label>
                  <input
                    type="date"
                    id="dueDate"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    min={getMinDate()}
                    required
                    disabled={isLoading}
                    style={styles.input}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                </div>
              </div>

              <div style={styles.formRowGroup}>
                <div style={styles.formGroup}>
                  <label htmlFor="dueTime" style={styles.label}>
                    🕒 Due Time
                    <span style={styles.featureBadge}>Optional</span>
                  </label>
                  <input
                    type="time"
                    id="dueTime"
                    value={dueTime}
                    onChange={(e) => setDueTime(e.target.value)}
                    disabled={isLoading}
                    style={styles.input}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                </div>
              </div>
            </div>
          </>
        );

      case 'collaboration':
        return (
          <>
            {/* Collaboration Toggle */}
            <div style={{
              ...styles.collaborationToggle,
              ...(isCollaborative ? styles.collaborationToggleActive : {})
            }}>
              <div style={styles.toggleHeader}>
                <div style={styles.toggleLabel}>
                  <span>👥</span>
                  Team Collaboration
                  <span style={styles.featureBadge}>Pro Feature</span>
                </div>
                <label style={styles.toggleSwitch}>
                  <input
                    type="checkbox"
                    checked={isCollaborative}
                    onChange={(e) => setIsCollaborative(e.target.checked)}
                    disabled={isLoading}
                    style={{ display: 'none' }}
                  />
                  <span style={{
                    ...styles.toggleSlider,
                    ...(isCollaborative ? styles.toggleChecked : {})
                  }}>
                    <span style={{
                      ...styles.toggleSliderBefore,
                      ...(isCollaborative ? styles.toggleCheckedBefore : {})
                    }}></span>
                  </span>
                </label>
              </div>
              <p style={{ margin: '0', color: '#718096', fontSize: '15px', lineHeight: '1.6' }}>
                {isCollaborative 
                  ? 'Team collaboration enabled. Assign team members and they will receive email notifications, task updates, and progress tracking.'
                  : 'Enable to assign this task to team members and enable real-time collaboration features.'
                }
              </p>
            </div>

            {/* User Assignment Section */}
            <div style={styles.userAssignment}>
              <label style={styles.label}>
                👥 Assign Team Members
                <span style={styles.featureBadge}>Collaborators</span>
              </label>
              <p style={{ margin: '8px 0 16px 0', color: '#718096', fontSize: '15px', lineHeight: '1.6' }}>
                Select team members to collaborate on this task. They will receive email notifications, task assignments, and can track progress in real-time.
              </p>
              
              <input
                type="text"
                placeholder="🔍 Search team members by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={isLoading}
                style={styles.userSearch}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
              
              {assignedUsers.length > 0 && (
                <div style={styles.assignedUsers}>
                  {assignedUsers.map(user => (
                    user && (
                      <div key={user._id} style={styles.assignedUserTag}>
                        👤 {user.username || 'Unknown User'}
                        <button
                          type="button"
                          style={styles.removeUserBtn}
                          onClick={() => handleUserRemove(user._id)}
                          disabled={isLoading}
                          onMouseEnter={(e) => {
                            e.target.style.background = 'rgba(255, 255, 255, 0.5)';
                            e.target.style.transform = 'scale(1.1)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                            e.target.style.transform = 'scale(1)';
                          }}
                        >
                          ×
                        </button>
                      </div>
                    )
                  ))}
                </div>
              )}

              <div style={styles.userList}>
                {filteredUsers
                  .filter(user => user && !assignedUsers.find(u => u && u._id === user._id))
                  .map(user => (
                    user && (
                      <div
                        key={user._id}
                        style={styles.userItem}
                        onClick={() => handleUserSelect(user)}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = styles.userItemHover.backgroundColor;
                          e.target.style.transform = styles.userItemHover.transform;
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = 'white';
                          e.target.style.transform = 'none';
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: '600', fontSize: '15px' }}>👤 {user.username || 'Unknown User'}</div>
                          <div style={{ color: '#718096', fontSize: '13px', marginTop: '4px' }}>📧 {user.email || 'No email'}</div>
                        </div>
                        <span style={{ 
                          color: '#667eea', 
                          fontSize: '12px', 
                          fontWeight: '700',
                          background: 'rgba(102, 126, 234, 0.1)',
                          padding: '4px 8px',
                          borderRadius: '8px'
                        }}>
                          + Assign
                        </span>
                      </div>
                    )
                  ))}
              </div>
            </div>
          </>
        );

      case 'notifications':
        return (
          <>
            {/* Enhanced Notification Settings Section */}
            <div style={styles.notificationSection}>
              <div style={styles.notificationHeader}>
                <label style={styles.label}>
                  🔔 Smart Notifications
                  <span style={styles.featureBadge}>Smart</span>
                </label>
                <div style={styles.checkboxContainer}>
                  <input
                    type="checkbox"
                    checked={reminder}
                    onChange={(e) => setReminder(e.target.checked)}
                    disabled={isLoading}
                    style={styles.checkbox}
                  />
                  <div>
                    <strong style={{ fontSize: '16px' }}>Enable All Notifications</strong>
                    <p style={{ margin: '4px 0 0 0', color: '#718096', fontSize: '14px' }}>
                      Receive smart notifications for task updates, reminders, and team collaboration
                    </p>
                  </div>
                </div>
              </div>

              {reminder && (
                <>
                  <div style={{ marginBottom: '24px' }}>
                    <h4 style={{ 
                      margin: '0 0 16px 0', 
                      color: '#2d3748', 
                      fontSize: '16px',
                      fontWeight: '700'
                    }}>
                      ⏰ Reminder Schedule
                    </h4>
                    <p style={{ margin: '0 0 20px 0', color: '#718096', fontSize: '14px', lineHeight: '1.5' }}>
                      Choose when you want to be reminded about this task. Multiple reminders can be selected.
                    </p>
                    
                    <div style={styles.reminderOptionsGrid}>
                      {/* 5 Minutes Before */}
                      <div
                        style={{
                          ...styles.reminderOption,
                          ...(reminderTimings.fiveMinutes ? styles.reminderOptionSelected : {})
                        }}
                        onClick={() => handleReminderTimingChange('fiveMinutes')}
                      >
                        <span style={styles.reminderIcon}>⏱️</span>
                        <div style={styles.reminderTitle}>5 Minutes</div>
                        <div style={styles.reminderDescription}>Quick reminder right before</div>
                      </div>

                      {/* 1 Hour Before */}
                      <div
                        style={{
                          ...styles.reminderOption,
                          ...(reminderTimings.oneHour ? styles.reminderOptionSelected : {})
                        }}
                        onClick={() => handleReminderTimingChange('oneHour')}
                      >
                        <span style={styles.reminderIcon}>🕐</span>
                        <div style={styles.reminderTitle}>1 Hour</div>
                        <div style={styles.reminderDescription}>Prepare and get ready</div>
                      </div>

                      {/* 1 Day Before */}
                      <div
                        style={{
                          ...styles.reminderOption,
                          ...(reminderTimings.oneDay ? styles.reminderOptionSelected : {})
                        }}
                        onClick={() => handleReminderTimingChange('oneDay')}
                      >
                        <span style={styles.reminderIcon}>📅</span>
                        <div style={styles.reminderTitle}>24 Hours</div>
                        <div style={styles.reminderDescription}>Plan your day ahead</div>
                      </div>

                      {/* Custom Time */}
                      <div
                        style={{
                          ...styles.reminderOption,
                          ...(reminderTimings.custom ? styles.reminderOptionSelected : {})
                        }}
                        onClick={() => handleReminderTimingChange('custom')}
                      >
                        <span style={styles.reminderIcon}>⚙️</span>
                        <div style={styles.reminderTitle}>Custom</div>
                        <div style={styles.reminderDescription}>Set your own timing</div>
                        {reminderTimings.custom && (
                          <input
                            type="text"
                            placeholder="e.g., 30min, 2hours"
                            value={reminderTimings.customTime}
                            onChange={(e) => setReminderTimings(prev => ({
                              ...prev,
                              customTime: e.target.value
                            }))}
                            style={styles.customReminderInput}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Notification Channels */}
                  <div>
                    <h4 style={{ 
                      margin: '0 0 16px 0', 
                      color: '#2d3748', 
                      fontSize: '16px',
                      fontWeight: '700'
                    }}>
                      📱 Notification Channels
                    </h4>
                    <div style={{ background: 'white', borderRadius: '14px', padding: '20px', border: '1px solid #e2e8f0' }}>
                      <div style={styles.checkboxContainer}>
                        <input type="checkbox" checked={true} style={styles.checkbox} readOnly />
                        <div>
                          <strong>📧 Email Notifications</strong>
                          <p style={{ margin: '4px 0 0 0', color: '#718096', fontSize: '14px' }}>
                            Receive detailed task updates via email
                          </p>
                        </div>
                      </div>
                      <div style={styles.checkboxContainer}>
                        <input type="checkbox" checked={true} style={styles.checkbox} readOnly />
                        <div>
                          <strong>🔔 Push Notifications</strong>
                          <p style={{ margin: '4px 0 0 0', color: '#718096', fontSize: '14px' }}>
                            Instant alerts on your devices
                          </p>
                        </div>
                      </div>
                      <div style={styles.checkboxContainer}>
                        <input type="checkbox" checked={false} style={styles.checkbox} readOnly />
                        <div>
                          <strong>💬 SMS Alerts</strong>
                          <p style={{ margin: '4px 0 0 0', color: '#718096', fontSize: '14px' }}>
                            Text message reminders (Premium)
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Summary */}
                  <div style={{ 
                    marginTop: '20px', 
                    padding: '16px', 
                    background: 'rgba(102, 126, 234, 0.08)', 
                    borderRadius: '12px',
                    border: '1px solid rgba(102, 126, 234, 0.2)'
                  }}>
                    <p style={{ margin: '0', color: '#667eea', fontSize: '14px', fontWeight: '600' }}>
                      ✅ Notifications configured for:
                    </p>
                    <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px', color: '#718096', fontSize: '13px' }}>
                      {reminderTimings.fiveMinutes && <li>⏱️ Reminder 5 minutes before deadline</li>}
                      {reminderTimings.oneHour && <li>🕐 Reminder 1 hour before deadline</li>}
                      {reminderTimings.oneDay && <li>📅 Reminder 24 hours before deadline</li>}
                      {reminderTimings.custom && reminderTimings.customTime && <li>⚙️ Custom reminder: {reminderTimings.customTime}</li>}
                      <li>📧 Email notifications for all updates</li>
                      <li>🔔 Push notifications on your devices</li>
                      {assignedUsers.length > 0 && <li>👥 Team collaboration updates</li>}
                      <li>📊 Progress tracking notifications</li>
                    </ul>
                  </div>
                </>
              )}
            </div>
          </>
        );

      default:
        return null;
    }
  };

  if (!token) {
    return (
      <div style={styles.container}>
        <div style={styles.backgroundOrb1}></div>
        <div style={styles.backgroundOrb2}></div>
        <div style={styles.backgroundOrb3}></div>
        <div style={styles.wrapper}>
          <div style={styles.errorMessage}>
            <h3 style={{ margin: '0 0 12px 0', color: '#742a2a' }}>🔐 Authentication Required</h3>
            <p style={{ margin: '0 0 20px 0', lineHeight: '1.6' }}>
              Your session has expired. Please login again to continue.
            </p>
            <button 
              onClick={() => navigate('/login')}
              style={{
                ...styles.btnPrimary,
                ...(isLoading ? styles.btnDisabled : {})
              }}
              onMouseEnter={(e) => handleMouseEnter(e, 'primary')}
              onMouseLeave={(e) => handleMouseLeave(e, 'primary')}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span style={styles.loadingSpinner}></span>
                  Redirecting...
                </>
              ) : (
                'Go to Login'
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.backgroundOrb1}></div>
      <div style={styles.backgroundOrb2}></div>
      <div style={styles.backgroundOrb3}></div>
      
      <div style={styles.wrapper}>
        <div style={styles.header}>
          <h2 style={styles.heading}>Create New Task</h2>
          <p style={styles.subheading}>
            Plan, collaborate, and stay organized with smart task management features
          </p>
        </div>
        
        {error && (
          <div style={styles.errorMessage}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ ...styles.icon, color: '#e53e3e' }}>⚠️</span>
              <strong style={{ fontSize: '18px' }}>Action Required</strong>
            </div>
            <p style={{ margin: '8px 0', lineHeight: '1.6', fontSize: '15px' }}>{error}</p>
            <div style={styles.errorActions}>
              <button 
                onClick={() => window.location.reload()}
                style={{
                  ...styles.btnSecondary,
                  ...(isLoading ? styles.btnDisabled : {})
                }}
                onMouseEnter={(e) => handleMouseEnter(e, 'secondary')}
                onMouseLeave={(e) => handleMouseLeave(e, 'secondary')}
                disabled={isLoading}
              >
                🔄 Retry
              </button>
              <button 
                onClick={() => navigate('/dashboard')}
                style={{
                  ...styles.btnPrimary,
                  ...(isLoading ? styles.btnDisabled : {})
                }}
                onMouseEnter={(e) => handleMouseEnter(e, 'primary')}
                onMouseLeave={(e) => handleMouseLeave(e, 'primary')}
                disabled={isLoading}
              >
                📊 Dashboard
              </button>
            </div>
          </div>
        )}
        
        {/* Navigation Tabs */}
        <div style={styles.tabs}>
          <button 
            style={{
              ...styles.tab,
              ...(activeTab === 'basic' ? styles.tabActive : {})
            }}
            onClick={() => setActiveTab('basic')}
          >
            📝 Basic Info
          </button>
          <button 
            style={{
              ...styles.tab,
              ...(activeTab === 'collaboration' ? styles.tabActive : {})
            }}
            onClick={() => setActiveTab('collaboration')}
          >
            👥 Collaboration
          </button>
          <button 
            style={{
              ...styles.tab,
              ...(activeTab === 'notifications' ? styles.tabActive : {})
            }}
            onClick={() => setActiveTab('notifications')}
          >
            🔔 Notifications
          </button>
        </div>
        
        <form onSubmit={handleSubmit} style={isLoading ? { ...styles.successState } : {}}>
          {renderTabContent()}

          <div style={styles.formActions}>
            <button 
              type="button" 
              style={{
                ...styles.btnSecondary,
                ...(isLoading ? styles.btnDisabled : {})
              }}
              onClick={() => navigate('/dashboard')}
              onMouseEnter={(e) => handleMouseEnter(e, 'secondary')}
              onMouseLeave={(e) => handleMouseLeave(e, 'secondary')}
              disabled={isLoading}
            >
              ← Back to Dashboard
            </button>
            <button 
              type="submit" 
              style={{
                ...styles.btnPrimary,
                ...(isLoading ? styles.btnDisabled : {})
              }}
              onMouseEnter={(e) => handleMouseEnter(e, 'primary')}
              onMouseLeave={(e) => handleMouseLeave(e, 'primary')}
              disabled={isLoading || !token}
            >
              {isLoading ? (
                <>
                  <span style={styles.loadingSpinner}></span>
                  Creating Task...
                </>
              ) : (
                `🚀 ${isCollaborative ? 'Create Team Task' : 'Create Task'}`
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Add CSS animations */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(5deg); }
          }
          @keyframes slideIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          *:focus {
            outline: none;
          }
          body {
            margin: 0;
            padding: 0;
            background: #f7fafc;
          }
          
          /* Enhanced hover effects */
          .tab:hover:not(.tabActive) {
            background: rgba(255, 255, 255, 0.5);
            transform: translateY(-1px);
          }
          
          .reminderOption:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
          }
          
          .checkboxContainer:hover {
            background: rgba(102, 126, 234, 0.05);
            transform: translateX(4px);
          }
        `}
      </style>
    </div>
  );
};

export default AddTask;