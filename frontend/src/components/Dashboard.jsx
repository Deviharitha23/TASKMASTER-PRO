// Dashboard.jsx - Enhanced with Notification Features and Improved Styling
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = ({ user: propUser, token, onLogout }) => {
  const [localUser, setLocalUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    overdue: 0
  });
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showSettings, setShowSettings] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [notificationCount, setNotificationCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user from props or localStorage
    if (propUser) {
      setLocalUser(propUser);
    } else {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          setLocalUser(JSON.parse(userData));
        } catch (error) {
          console.error('Error parsing user data:', error);
          window.location.href = '/login';
          return;
        }
      } else {
        window.location.href = '/login';
        return;
      }
    }
    
    fetchTasks();
    fetchStats();
    checkUpcomingNotifications();
    
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    const notificationTimer = setInterval(checkUpcomingNotifications, 30000); // Check every 30 seconds
    
    return () => {
      clearInterval(timer);
      clearInterval(notificationTimer);
    };
  }, [propUser]);

  // Safe user data access
  const safeUser = localUser || propUser || JSON.parse(localStorage.getItem('user') || '{}');
  const userName = safeUser?.name || 'User';
  const userEmail = safeUser?.email || '';
  const userInitial = (userName?.charAt(0) || 'U').toUpperCase();

  const checkUpcomingNotifications = () => {
    const now = new Date();
    const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
    const twentyFourHoursFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    
    const upcomingTasks = tasks.filter(task => {
      if (task.status === 'completed') return false;
      
      const dueDate = new Date(task.dueDate);
      const timeDiff = dueDate.getTime() - now.getTime();
      const hoursDiff = timeDiff / (1000 * 60 * 60);
      
      // Check if task is due within 1 hour or 24 hours
      return hoursDiff <= 24 && hoursDiff > 0;
    });
    
    setNotificationCount(upcomingTasks.length);
  };

  const fetchTasks = async () => {
    try {
      const authToken = token || localStorage.getItem('token');
      if (!authToken) {
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:5000/api/tasks', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        setTasks(result.tasks || []);
      } else {
        // Fallback mock data
        setTasks([
          {
            _id: '1',
            title: 'Complete project documentation',
            description: 'Write comprehensive documentation for the TaskMaster Pro project',
            dueDate: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
            priority: 'high',
            status: 'inProgress'
          },
          {
            _id: '2',
            title: 'Design user dashboard',
            description: 'Create modern UI for the main dashboard interface',
            dueDate: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
            priority: 'medium',
            status: 'pending'
          },
          {
            _id: '3',
            title: 'Setup database schema',
            description: 'Design and implement database structure',
            dueDate: new Date(Date.now() - 86400000),
            priority: 'high',
            status: 'completed'
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setTasks([
        {
          _id: '1',
          title: 'Welcome to TaskMaster Pro!',
          description: 'Start by creating your first task and exploring the features',
          dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
          priority: 'medium',
          status: 'pending'
        }
      ]);
    }
  };

  const fetchStats = async () => {
    try {
      const authToken = token || localStorage.getItem('token');
      if (!authToken) {
        setStats({
          total: 3,
          completed: 1,
          inProgress: 1,
          overdue: 1
        });
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:5000/api/tasks-stats', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        setStats(result.stats || {});
      } else {
        setStats({
          total: 3,
          completed: 1,
          inProgress: 1,
          overdue: 1
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats({
        total: 3,
        completed: 1,
        inProgress: 1,
        overdue: 1
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    if (onLogout) {
      onLogout();
    } else {
      window.location.href = '/login';
    }
  };

  const handleAddTask = () => {
    navigate('/add-task');
  };

  const handleCalendar = () => {
    navigate('/calendar');
  };

  const handleAnalytics = () => {
    navigate('/analytics');
  };

  const handleDashboard = () => {
    navigate('/dashboard');
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      const authToken = token || localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        fetchTasks();
        fetchStats();
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const deleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        const authToken = token || localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });

        if (response.ok) {
          fetchTasks();
          fetchStats();
        }
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#f56565';
      case 'medium': return '#ed8936';
      case 'low': return '#48bb78';
      default: return '#a0aec0';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#48bb78';
      case 'inProgress': return '#ed8936';
      case 'pending': return '#f56565';
      default: return '#a0aec0';
    }
  };

  const getUpcomingNotifications = () => {
    const now = new Date();
    return tasks.filter(task => {
      if (task.status === 'completed') return false;
      
      const dueDate = new Date(task.dueDate);
      const timeDiff = dueDate.getTime() - now.getTime();
      const hoursDiff = timeDiff / (1000 * 60 * 60);
      
      return hoursDiff <= 24 && hoursDiff > 0;
    }).map(task => {
      const dueDate = new Date(task.dueDate);
      const timeDiff = dueDate.getTime() - now.getTime();
      const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60));
      const minutesDiff = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      
      let timeText = '';
      if (hoursDiff > 0) {
        timeText = `${hoursDiff}h ${minutesDiff}m`;
      } else {
        timeText = `${minutesDiff}m`;
      }
      
      return {
        ...task,
        timeRemaining: timeText,
        isUrgent: hoursDiff < 1
      };
    });
  };

  const filteredTasks = tasks.filter(task => {
    if (activeFilter === 'all') return true;
    return task.status === activeFilter;
  });

  if (!localUser && !propUser && !localStorage.getItem('user')) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}></div>
        <p style={styles.loadingText}>Loading your dashboard...</p>
      </div>
    );
  }

  const upcomingNotifications = getUpcomingNotifications();

  return (
    <div style={styles.container}>
      {/* Enhanced Background */}
      <div style={styles.backgroundAnimation}></div>
      
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logoSection}>
            <div style={styles.logoIcon}>🚀</div>
            <div>
              <h1 style={styles.logo}>TaskMaster Pro</h1>
              <p style={styles.logoSubtitle}>Productivity Suite</p>
            </div>
          </div>
          
          {/* Navigation Menu */}
          <nav style={styles.navigation}>
            <button 
              onClick={handleDashboard}
              style={styles.navButton}
              title="Dashboard"
            >
              📊 Dashboard
            </button>
            <button 
              onClick={handleCalendar}
              style={styles.navButton}
              title="Calendar View"
            >
              📅 Calendar
            </button>
            <button 
              onClick={handleAnalytics}
              style={styles.navButton}
              title="Analytics"
            >
              📈 Analytics
            </button>
            <button 
              onClick={handleAddTask}
              style={styles.navButton}
              title="Add New Task"
            >
              ➕ Add Task
            </button>
          </nav>

          <div style={styles.headerRight}>
            <div style={styles.timeDisplay}>
              <div style={styles.currentTime}>
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div style={styles.currentDate}>
                {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </div>
            </div>
            
            {/* Notifications Bell */}
            <div style={styles.notificationContainer}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                style={styles.notificationButton}
                title="Notifications"
              >
                🔔
                {notificationCount > 0 && (
                  <span style={styles.notificationBadge}>
                    {notificationCount}
                  </span>
                )}
              </button>
              
              {showNotifications && (
                <div style={styles.notificationDropdown}>
                  <div style={styles.notificationHeader}>
                    <h4>Upcoming Tasks</h4>
                    <span style={styles.notificationCount}>
                      {upcomingNotifications.length} tasks
                    </span>
                  </div>
                  <div style={styles.notificationList}>
                    {upcomingNotifications.length > 0 ? (
                      upcomingNotifications.map((task) => (
                        <div 
                          key={task._id} 
                          style={{
                            ...styles.notificationItem,
                            ...(task.isUrgent ? styles.urgentNotification : {})
                          }}
                        >
                          <div style={styles.notificationContent}>
                            <strong style={styles.notificationTitle}>
                              {task.title}
                            </strong>
                            <span style={styles.notificationTime}>
                              Due in {task.timeRemaining}
                            </span>
                          </div>
                          <span 
                            style={{
                              ...styles.priorityDot,
                              backgroundColor: getPriorityColor(task.priority)
                            }}
                          ></span>
                        </div>
                      ))
                    ) : (
                      <div style={styles.noNotifications}>
                        No upcoming tasks
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div style={styles.userInfo}>
              <div style={styles.userDetails}>
                <span style={styles.userName}>{userName}</span>
                <span style={styles.userEmail}>{userEmail}</span>
              </div>
              <div style={styles.userAvatar}>
                {userInitial}
              </div>
              <button 
                onClick={() => setShowSettings(true)}
                style={styles.settingsButton}
                title="Notification Settings"
              >
                ⚙️
              </button>
              <button onClick={handleLogout} style={styles.logoutButton}>
                <span style={styles.logoutIcon}>🚪</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Settings Modal */}
      {showSettings && (
        <NotificationSettings 
          user={safeUser} 
          token={token} 
          onClose={() => setShowSettings(false)} 
        />
      )}

      {/* Main Content */}
      <main style={styles.main}>
        <div style={styles.content}>
          {/* Welcome Section */}
          <section style={styles.welcomeSection}>
            <div style={styles.welcomeContent}>
              <h2 style={styles.greeting}>
                {getGreeting()}, {userName}! 👋
              </h2>
              <p style={styles.subGreeting}>
                {upcomingNotifications.length > 0 
                  ? `You have ${upcomingNotifications.length} upcoming task${upcomingNotifications.length > 1 ? 's' : ''} to complete`
                  : 'You\'re all caught up! Ready to tackle new challenges?'
                }
              </p>
              
              {/* Quick Stats */}
              <div style={styles.quickStats}>
                <div style={styles.quickStat}>
                  <span style={styles.quickStatNumber}>{stats.completed}</span>
                  <span style={styles.quickStatLabel}>Completed Today</span>
                </div>
                <div style={styles.quickStat}>
                  <span style={styles.quickStatNumber}>{stats.inProgress}</span>
                  <span style={styles.quickStatLabel}>In Progress</span>
                </div>
                <div style={styles.quickStat}>
                  <span style={styles.quickStatNumber}>{upcomingNotifications.length}</span>
                  <span style={styles.quickStatLabel}>Upcoming</span>
                </div>
              </div>
            </div>
            <div style={styles.quickActions}>
              <button onClick={handleAddTask} style={styles.primaryButton}>
                <span style={styles.buttonIcon}>+</span>
                Add New Task
              </button>
              <button onClick={handleCalendar} style={styles.secondaryButton}>
                <span style={styles.buttonIcon}>📅</span>
                Calendar View
              </button>
              <button onClick={handleAnalytics} style={styles.secondaryButton}>
                <span style={styles.buttonIcon}>📈</span>
                Analytics
              </button>
            </div>
          </section>

          {/* Stats Grid */}
          <section style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={{...styles.statIcon, background: 'linear-gradient(135deg, #667eea, #764ba2)'}}>
                <span style={styles.statIconEmoji}>📋</span>
              </div>
              <div style={styles.statInfo}>
                <h3 style={styles.statNumber}>{stats.total}</h3>
                <p style={styles.statLabel}>Total Tasks</p>
                <p style={styles.statSubtext}>Across all categories</p>
              </div>
            </div>
            <div style={styles.statCard}>
              <div style={{...styles.statIcon, background: 'linear-gradient(135deg, #68d391, #48bb78)'}}>
                <span style={styles.statIconEmoji}>✅</span>
              </div>
              <div style={styles.statInfo}>
                <h3 style={styles.statNumber}>{stats.completed}</h3>
                <p style={styles.statLabel}>Completed</p>
                <p style={styles.statSubtext}>{stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}% success rate</p>
              </div>
            </div>
            <div style={styles.statCard}>
              <div style={{...styles.statIcon, background: 'linear-gradient(135deg, #ed8936, #dd6b20)'}}>
                <span style={styles.statIconEmoji}>🔄</span>
              </div>
              <div style={styles.statInfo}>
                <h3 style={styles.statNumber}>{stats.inProgress}</h3>
                <p style={styles.statLabel}>In Progress</p>
                <p style={styles.statSubtext}>Active tasks</p>
              </div>
            </div>
            <div style={styles.statCard}>
              <div style={{...styles.statIcon, background: 'linear-gradient(135deg, #fc8181, #f56565)'}}>
                <span style={styles.statIconEmoji}>⏰</span>
              </div>
              <div style={styles.statInfo}>
                <h3 style={styles.statNumber}>{stats.overdue}</h3>
                <p style={styles.statLabel}>Overdue</p>
                <p style={styles.statSubtext}>Needs attention</p>
              </div>
            </div>
          </section>

          {/* Tasks Section */}
          <section style={styles.tasksSection}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>
                Your Tasks
                <span style={styles.taskCount}>({filteredTasks.length})</span>
              </h2>
              <div style={styles.taskFilters}>
                <button 
                  onClick={() => setActiveFilter('all')}
                  style={{
                    ...styles.filterButton,
                    ...(activeFilter === 'all' ? styles.filterButtonActive : {})
                  }}
                >
                  All
                </button>
                <button 
                  onClick={() => setActiveFilter('pending')}
                  style={{
                    ...styles.filterButton,
                    ...(activeFilter === 'pending' ? styles.filterButtonActive : {})
                  }}
                >
                  Pending
                </button>
                <button 
                  onClick={() => setActiveFilter('inProgress')}
                  style={{
                    ...styles.filterButton,
                    ...(activeFilter === 'inProgress' ? styles.filterButtonActive : {})
                  }}
                >
                  In Progress
                </button>
                <button 
                  onClick={() => setActiveFilter('completed')}
                  style={{
                    ...styles.filterButton,
                    ...(activeFilter === 'completed' ? styles.filterButtonActive : {})
                  }}
                >
                  Completed
                </button>
              </div>
            </div>

            {loading ? (
              <div style={styles.loadingState}>
                <div style={styles.loadingSpinner}></div>
                <p style={styles.loadingText}>Loading tasks...</p>
              </div>
            ) : (
              <div style={styles.tasksGrid}>
                {filteredTasks.map((task) => {
                  const dueDate = new Date(task.dueDate);
                  const now = new Date();
                  const timeDiff = dueDate.getTime() - now.getTime();
                  const hoursDiff = timeDiff / (1000 * 60 * 60);
                  const isUpcoming = hoursDiff <= 24 && hoursDiff > 0 && task.status !== 'completed';
                  const isUrgent = hoursDiff < 1 && task.status !== 'completed';
                  
                  return (
                    <div 
                      key={task._id} 
                      style={{
                        ...styles.taskCard,
                        ...(isUrgent ? styles.urgentTask : {}),
                        ...(isUpcoming ? styles.upcomingTask : {})
                      }}
                    >
                      <div style={styles.taskHeader}>
                        <div style={styles.taskTitleSection}>
                          <h3 style={styles.taskTitle}>{task.title}</h3>
                          <div style={styles.taskBadges}>
                            <span 
                              style={{
                                ...styles.priorityBadge,
                                backgroundColor: getPriorityColor(task.priority)
                              }}
                            >
                              {task.priority}
                            </span>
                            {isUrgent && (
                              <span style={styles.urgentBadge}>
                                ⚡ URGENT
                              </span>
                            )}
                            {isUpcoming && !isUrgent && (
                              <span style={styles.upcomingBadge}>
                                ⏰ SOON
                              </span>
                            )}
                          </div>
                        </div>
                        <div style={styles.taskActions}>
                          <select
                            value={task.status}
                            onChange={(e) => updateTaskStatus(task._id, e.target.value)}
                            style={{
                              ...styles.statusSelect,
                              borderColor: getStatusColor(task.status)
                            }}
                          >
                            <option value="pending">Pending</option>
                            <option value="inProgress">In Progress</option>
                            <option value="completed">Completed</option>
                          </select>
                          <button 
                            onClick={() => deleteTask(task._id)}
                            style={styles.deleteButton}
                            title="Delete task"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                      <p style={styles.taskDescription}>{task.description}</p>
                      <div style={styles.taskFooter}>
                        <span style={styles.dueDate}>
                          📅 Due: {dueDate.toLocaleDateString()} at {dueDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span style={{
                          ...styles.statusBadge,
                          backgroundColor: getStatusColor(task.status)
                        }}>
                          {task.status}
                        </span>
                      </div>
                      {isUpcoming && (
                        <div style={styles.timeRemainingBar}>
                          <div 
                            style={{
                              ...styles.timeRemainingFill,
                              width: `${Math.max(5, 100 - (hoursDiff / 24) * 100)}%`,
                              backgroundColor: isUrgent ? '#f56565' : '#ed8936'
                            }}
                          ></div>
                          <span style={styles.timeRemainingText}>
                            {isUrgent ? 'Due soon!' : `Due in ${Math.floor(hoursDiff)}h`}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {!loading && filteredTasks.length === 0 && (
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>📝</div>
                <h3 style={styles.emptyTitle}>
                  {activeFilter === 'all' ? 'No tasks yet' : `No ${activeFilter} tasks`}
                </h3>
                <p style={styles.emptyText}>
                  {activeFilter === 'all' 
                    ? "Get started by creating your first task and boost your productivity!"
                    : `No ${activeFilter} tasks found. Try changing the filter.`
                  }
                </p>
                <button onClick={handleAddTask} style={styles.primaryButton}>
                  Create Your First Task
                </button>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

// Notification Settings Component (unchanged)
const NotificationSettings = ({ user, token, onClose }) => {
  const [settings, setSettings] = useState({
    emailNotifications: user?.emailNotifications !== false,
    taskReminders: user?.taskReminders !== false,
    weeklyDigest: user?.weeklyDigest !== false,
    productivityReports: user?.productivityReports !== false
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setSettings({
        emailNotifications: user.emailNotifications !== false,
        taskReminders: user.taskReminders !== false,
        weeklyDigest: user.weeklyDigest !== false,
        productivityReports: user.productivityReports !== false
      });
    }
  }, [user]);

  const updateSettings = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      const authToken = token || localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/notification-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(settings)
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessage('✅ Settings updated successfully!');
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        const updatedUser = { ...userData, ...settings };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      } else {
        setMessage('❌ ' + (data.message || 'Error updating settings'));
      }
    } catch (error) {
      setMessage('❌ Error updating settings: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const sendTestEmail = async () => {
    try {
      const authToken = token || localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/send-test-email', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('✅ ' + data.message);
      } else {
        setMessage('❌ ' + (data.message || 'Error sending test email'));
      }
    } catch (error) {
      setMessage('❌ Error sending test email: ' + error.message);
    }
  };

  return (
    <div style={styles.settingsOverlay}>
      <div style={styles.settingsModal}>
        <div style={styles.settingsHeader}>
          <h3 style={styles.settingsTitle}>Notification Settings</h3>
          <button onClick={onClose} style={styles.closeButton}>✕</button>
        </div>
        
        <div style={styles.settingsContent}>
          <div style={styles.settingItem}>
            <label style={styles.label}>
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => setSettings({
                  ...settings,
                  emailNotifications: e.target.checked
                })}
                style={styles.checkbox}
              />
              <span style={styles.labelText}>Enable email notifications</span>
            </label>
            <p style={styles.description}>
              Receive email notifications for task updates and reminders
            </p>
          </div>

          <div style={styles.settingItem}>
            <label style={styles.label}>
              <input
                type="checkbox"
                checked={settings.taskReminders}
                onChange={(e) => setSettings({
                  ...settings,
                  taskReminders: e.target.checked
                })}
                style={styles.checkbox}
                disabled={!settings.emailNotifications}
              />
              <span style={!settings.emailNotifications ? styles.disabledText : styles.labelText}>
                Task reminders (1 hour & 24 hours before due date)
              </span>
            </label>
            <p style={styles.description}>
              Get reminded about upcoming and overdue tasks via email
            </p>
          </div>

          <div style={styles.settingItem}>
            <label style={styles.label}>
              <input
                type="checkbox"
                checked={settings.weeklyDigest}
                onChange={(e) => setSettings({
                  ...settings,
                  weeklyDigest: e.target.checked
                })}
                style={styles.checkbox}
                disabled={!settings.emailNotifications}
              />
              <span style={!settings.emailNotifications ? styles.disabledText : styles.labelText}>
                Weekly digest
              </span>
            </label>
            <p style={styles.description}>
              Receive a weekly summary of your productivity every Monday
            </p>
          </div>

          <div style={styles.settingItem}>
            <label style={styles.label}>
              <input
                type="checkbox"
                checked={settings.productivityReports}
                onChange={(e) => setSettings({
                  ...settings,
                  productivityReports: e.target.checked
                })}
                style={styles.checkbox}
                disabled={!settings.emailNotifications}
              />
              <span style={!settings.emailNotifications ? styles.disabledText : styles.labelText}>
                Productivity reports
              </span>
            </label>
            <p style={styles.description}>
              Monthly insights and productivity analytics on the 1st of each month
            </p>
          </div>

          {message && (
            <div style={{
              ...styles.message,
              ...(message.includes('✅') ? styles.successMessage : styles.errorMessage)
            }}>
              {message}
            </div>
          )}

          <div style={styles.actions}>
            <button 
              onClick={updateSettings}
              disabled={loading}
              style={{
                ...styles.saveButton,
                opacity: loading ? 0.6 : 1
              }}
            >
              {loading ? 'Saving...' : 'Save Settings'}
            </button>
            
            <button 
              onClick={sendTestEmail}
              style={styles.testButton}
              disabled={!settings.emailNotifications || loading}
            >
              Send Test Email
            </button>
          </div>

          <div style={styles.infoBox}>
            <h4 style={styles.infoTitle}>📧 Email Notifications Include:</h4>
            <ul style={styles.featureList}>
              <li>✅ Welcome email when you register</li>
              <li>✅ Task creation confirmations</li>
              <li>✅ Task completion celebrations</li>
              <li>✅ 24-hour task reminders</li>
              <li>✅ 1-hour urgent reminders</li>
              <li>✅ Overdue task alerts</li>
              <li>✅ Weekly productivity summaries</li>
              <li>✅ Monthly analytics reports</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced CSS Styles with Background Animations
const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(-45deg, #667eea, #764ba2, #f093fb, #f5576c)',
    backgroundSize: '400% 400%',
    animation: 'gradientShift 15s ease infinite',
    fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    position: 'relative',
    overflow: 'hidden',
  },
  backgroundAnimation: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.2) 0%, transparent 50%)
    `,
    animation: 'floatBackground 20s ease-in-out infinite',
    zIndex: 0,
  },
  header: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
    padding: '1rem 0',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  headerContent: {
    maxWidth: '1400px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 2rem',
    gap: '2rem',
  },
  logoSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    flexShrink: 0,
  },
  logoIcon: {
    fontSize: '2.5rem',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    borderRadius: '16px',
    padding: '0.75rem',
    boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
    animation: 'bounce 2s infinite',
  },
  logo: {
    margin: 0,
    fontSize: '1.75rem',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '-0.5px',
  },
  logoSubtitle: {
    margin: 0,
    fontSize: '0.85rem',
    color: '#718096',
    fontWeight: '500',
    letterSpacing: '0.5px',
  },
  navigation: {
    display: 'flex',
    gap: '0.5rem',
    flex: 1,
    justifyContent: 'center',
  },
  navButton: {
    background: 'rgba(102, 126, 234, 0.1)',
    border: '1px solid rgba(102, 126, 234, 0.2)',
    color: '#667eea',
    padding: '0.75rem 1.25rem',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '600',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    flexShrink: 0,
  },
  timeDisplay: {
    textAlign: 'right',
  },
  currentTime: {
    fontSize: '1.3rem',
    fontWeight: '700',
    color: '#2d3748',
    fontFeatureSettings: '"tnum"',
  },
  currentDate: {
    fontSize: '0.9rem',
    color: '#718096',
    fontWeight: '500',
  },
  notificationContainer: {
    position: 'relative',
  },
  notificationButton: {
    background: 'rgba(255, 255, 255, 0.1)',
    border: 'none',
    color: '#2d3748',
    width: '50px',
    height: '50px',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '1.4rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    backdropFilter: 'blur(10px)',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: '-5px',
    right: '-5px',
    background: 'linear-gradient(135deg, #fc8181, #f56565)',
    color: 'white',
    borderRadius: '50%',
    width: '20px',
    height: '20px',
    fontSize: '0.7rem',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    animation: 'pulse 2s infinite',
  },
  notificationDropdown: {
    position: 'absolute',
    top: '100%',
    right: 0,
    width: '320px',
    background: 'white',
    borderRadius: '16px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    backdropFilter: 'blur(20px)',
    zIndex: 1000,
    marginTop: '0.5rem',
    animation: 'slideDown 0.3s ease-out',
  },
  notificationHeader: {
    padding: '1.5rem 1.5rem 1rem',
    borderBottom: '1px solid #f7fafc',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notificationCount: {
    fontSize: '0.8rem',
    color: '#718096',
    fontWeight: '600',
  },
  notificationList: {
    maxHeight: '300px',
    overflowY: 'auto',
  },
  notificationItem: {
    padding: '1rem 1.5rem',
    borderBottom: '1px solid #f7fafc',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    transition: 'all 0.2s ease',
  },
  urgentNotification: {
    background: 'rgba(252, 129, 129, 0.05)',
    borderLeft: '4px solid #f56565',
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    display: 'block',
    fontSize: '0.9rem',
    color: '#2d3748',
    marginBottom: '0.25rem',
  },
  notificationTime: {
    fontSize: '0.8rem',
    color: '#718096',
  },
  priorityDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    flexShrink: 0,
  },
  noNotifications: {
    padding: '2rem 1.5rem',
    textAlign: 'center',
    color: '#a0aec0',
    fontSize: '0.9rem',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  userDetails: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  userName: {
    fontWeight: '600',
    color: '#2d3748',
    fontSize: '0.95rem',
  },
  userEmail: {
    color: '#718096',
    fontSize: '0.8rem',
  },
  userAvatar: {
    width: '45px',
    height: '45px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: '700',
    fontSize: '1.1rem',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
  },
  settingsButton: {
    background: 'rgba(255, 255, 255, 0.1)',
    border: 'none',
    color: '#2d3748',
    width: '45px',
    height: '45px',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '1.3rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    backdropFilter: 'blur(10px)',
  },
  logoutButton: {
    background: 'linear-gradient(135deg, #fc8181, #f56565)',
    border: 'none',
    color: 'white',
    width: '45px',
    height: '45px',
    borderRadius: '10px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.1rem',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 4px 15px rgba(252, 129, 129, 0.3)',
  },
  main: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '2.5rem 2rem',
    position: 'relative',
    zIndex: 1,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2.5rem',
  },
  welcomeSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '24px',
    padding: '3rem',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    animation: 'fadeInUp 0.8s ease-out',
  },
  welcomeContent: {
    flex: 1,
  },
  greeting: {
    margin: '0 0 1rem 0',
    fontSize: '3rem',
    fontWeight: '800',
    color: '#2d3748',
    background: 'linear-gradient(135deg, #2d3748, #4a5568)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    lineHeight: '1.2',
  },
  subGreeting: {
    margin: '0 0 2rem 0',
    fontSize: '1.3rem',
    color: '#718096',
    fontWeight: '500',
    maxWidth: '500px',
  },
  quickStats: {
    display: 'flex',
    gap: '2rem',
  },
  quickStat: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  quickStatNumber: {
    fontSize: '2rem',
    fontWeight: '800',
    color: '#667eea',
    lineHeight: '1',
  },
  quickStatLabel: {
    fontSize: '0.9rem',
    color: '#718096',
    fontWeight: '600',
    marginTop: '0.5rem',
  },
  quickActions: {
    display: 'flex',
    gap: '1.25rem',
    flexShrink: 0,
  },
  primaryButton: {
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    border: 'none',
    color: 'white',
    padding: '1.2rem 2rem',
    borderRadius: '16px',
    cursor: 'pointer',
    fontWeight: '700',
    fontSize: '1rem',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    boxShadow: '0 8px 30px rgba(102, 126, 234, 0.4)',
    animation: 'pulse 2s infinite',
  },
  secondaryButton: {
    background: 'rgba(255, 255, 255, 0.15)',
    border: '2px solid rgba(255, 255, 255, 0.4)',
    color: 'white',
    padding: '1.2rem 1.75rem',
    borderRadius: '16px',
    cursor: 'pointer',
    fontWeight: '700',
    fontSize: '1rem',
    backdropFilter: 'blur(15px)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  buttonIcon: {
    fontSize: '1.2rem',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '2rem',
  },
  statCard: {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '20px',
    padding: '2.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
    animation: 'fadeInUp 0.8s ease-out 0.2s both',
  },
  statIcon: {
    width: '80px',
    height: '80px',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
  },
  statIconEmoji: {
    fontSize: '2.5rem',
  },
  statInfo: {
    flex: 1,
  },
  statNumber: {
    margin: 0,
    fontSize: '3rem',
    fontWeight: '800',
    color: '#2d3748',
    lineHeight: '1',
  },
  statLabel: {
    margin: '0.5rem 0 0.25rem 0',
    fontSize: '1.1rem',
    color: '#718096',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  statSubtext: {
    margin: 0,
    fontSize: '0.9rem',
    color: '#a0aec0',
    fontWeight: '500',
  },
  tasksSection: {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '24px',
    padding: '3rem',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    animation: 'fadeInUp 0.8s ease-out 0.4s both',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '3rem',
  },
  sectionTitle: {
    margin: 0,
    fontSize: '2rem',
    fontWeight: '800',
    color: '#2d3748',
    background: 'linear-gradient(135deg, #2d3748, #4a5568)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  taskCount: {
    fontSize: '1rem',
    color: '#718096',
    fontWeight: '600',
    background: 'none',
    WebkitTextFillColor: '#718096',
  },
  taskFilters: {
    display: 'flex',
    gap: '0.75rem',
  },
  filterButton: {
    background: 'rgba(102, 126, 234, 0.1)',
    border: '2px solid rgba(102, 126, 234, 0.2)',
    color: '#667eea',
    padding: '0.75rem 1.5rem',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '600',
    transition: 'all 0.3s ease',
  },
  filterButtonActive: {
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    color: 'white',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
    borderColor: 'transparent',
  },
  tasksGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
    gap: '2rem',
  },
  taskCard: {
    background: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: '20px',
    padding: '2.5rem',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
    position: 'relative',
    overflow: 'hidden',
    animation: 'fadeIn 0.6s ease-out',
  },
  urgentTask: {
    borderLeft: '6px solid #f56565',
    background: 'linear-gradient(135deg, white, #fff5f5)',
    boxShadow: '0 8px 30px rgba(245, 101, 101, 0.2)',
  },
  upcomingTask: {
    borderLeft: '6px solid #ed8936',
    background: 'linear-gradient(135deg, white, #fffaf0)',
  },
  taskHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1.5rem',
  },
  taskTitleSection: {
    flex: 1,
  },
  taskTitle: {
    margin: '0 0 1rem 0',
    fontSize: '1.4rem',
    fontWeight: '700',
    color: '#2d3748',
    lineHeight: '1.4',
  },
  taskBadges: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
  },
  priorityBadge: {
    padding: '0.5rem 1.2rem',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: '700',
    color: 'white',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    display: 'inline-block',
  },
  urgentBadge: {
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: '700',
    color: 'white',
    background: 'linear-gradient(135deg, #f56565, #e53e3e)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    display: 'inline-block',
    animation: 'pulse 1.5s infinite',
  },
  upcomingBadge: {
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: '700',
    color: 'white',
    background: 'linear-gradient(135deg, #ed8936, #dd6b20)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    display: 'inline-block',
  },
  taskActions: {
    display: 'flex',
    gap: '0.75rem',
    alignItems: 'center',
  },
  statusSelect: {
    padding: '0.6rem 0.9rem',
    borderRadius: '10px',
    border: '2px solid #cbd5e0',
    fontSize: '0.85rem',
    background: 'white',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  deleteButton: {
    background: 'rgba(252, 129, 129, 0.1)',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1.1rem',
    padding: '0.6rem',
    borderRadius: '10px',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskDescription: {
    margin: '0 0 2rem 0',
    color: '#718096',
    fontSize: '1rem',
    lineHeight: '1.6',
  },
  taskFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '1.5rem',
    borderTop: '1px solid #f7fafc',
  },
  dueDate: {
    fontSize: '0.9rem',
    color: '#718096',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  statusBadge: {
    padding: '0.5rem 1.2rem',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: '700',
    color: 'white',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  timeRemainingBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'rgba(237, 137, 54, 0.2)',
    overflow: 'hidden',
  },
  timeRemainingFill: {
    height: '100%',
    transition: 'width 0.3s ease',
    position: 'relative',
  },
  timeRemainingText: {
    position: 'absolute',
    top: '-25px',
    right: '1rem',
    fontSize: '0.75rem',
    color: '#ed8936',
    fontWeight: '600',
  },
  loadingState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '4rem',
    color: '#718096',
  },
  loadingSpinner: {
    width: '50px',
    height: '50px',
    border: '4px solid rgba(102, 126, 234, 0.2)',
    borderTop: '4px solid #667eea',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '1.5rem',
  },
  loadingText: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#4a5568',
  },
  emptyState: {
    textAlign: 'center',
    padding: '4rem',
    color: '#718096',
  },
  emptyIcon: {
    fontSize: '4rem',
    marginBottom: '1.5rem',
    opacity: 0.7,
  },
  emptyTitle: {
    margin: '0 0 1rem 0',
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#2d3748',
  },
  emptyText: {
    margin: '0 0 2rem 0',
    fontSize: '1rem',
    lineHeight: '1.6',
    maxWidth: '400px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  // Settings Modal Styles
  settingsOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(8px)',
    padding: '1rem',
  },
  settingsModal: {
    background: 'white',
    borderRadius: '24px',
    padding: '0',
    maxWidth: '520px',
    width: '100%',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 30px 100px rgba(0, 0, 0, 0.5)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
  },
  settingsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '2rem 2.5rem',
    borderBottom: '1px solid #e2e8f0',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
  },
  settingsTitle: {
    margin: 0,
    fontSize: '1.4rem',
    fontWeight: '700',
  },
  closeButton: {
    background: 'rgba(255, 255, 255, 0.2)',
    border: 'none',
    color: 'white',
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '1.1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
  },
  settingsContent: {
    padding: '2.5rem',
  },
  settingItem: {
    marginBottom: '2.5rem',
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    cursor: 'pointer',
    marginBottom: '0.75rem',
  },
  checkbox: {
    width: '20px',
    height: '20px',
    cursor: 'pointer',
    accentColor: '#667eea',
  },
  labelText: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#2d3748',
  },
  disabledText: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#a0aec0',
  },
  description: {
    fontSize: '0.95rem',
    color: '#718096',
    margin: '0.5rem 0 0 2rem',
    lineHeight: '1.5',
  },
  actions: {
    display: 'flex',
    gap: '1.25rem',
    marginBottom: '2.5rem',
  },
  saveButton: {
    background: 'linear-gradient(135deg, #68d391, #48bb78)',
    border: 'none',
    color: 'white',
    padding: '1rem 1.5rem',
    borderRadius: '12px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '1rem',
    flex: 1,
    transition: 'all 0.3s ease',
  },
  testButton: {
    background: 'rgba(102, 126, 234, 0.1)',
    border: '1px solid #667eea',
    color: '#667eea',
    padding: '1rem 1.5rem',
    borderRadius: '12px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '1rem',
    flex: 1,
    transition: 'all 0.3s ease',
  },
  message: {
    padding: '1rem',
    borderRadius: '12px',
    marginBottom: '1.5rem',
    fontSize: '0.95rem',
    fontWeight: '500',
    textAlign: 'center',
  },
  successMessage: {
    background: 'rgba(104, 211, 145, 0.1)',
    border: '1px solid #68d391',
    color: '#2f855a',
  },
  errorMessage: {
    background: 'rgba(252, 129, 129, 0.1)',
    border: '1px solid #fc8181',
    color: '#c53030',
  },
  infoBox: {
    background: 'rgba(102, 126, 234, 0.05)',
    borderRadius: '16px',
    padding: '2rem',
    border: '1px solid rgba(102, 126, 234, 0.1)',
  },
  infoTitle: {
    margin: '0 0 1.25rem 0',
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#2d3748',
    textAlign: 'center',
  },
  featureList: {
    margin: 0,
    paddingLeft: '1.5rem',
    color: '#4a5568',
    fontSize: '0.95rem',
    lineHeight: '1.8',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: 'linear-gradient(-45deg, #667eea, #764ba2, #f093fb, #f5576c)',
    backgroundSize: '400% 400%',
    animation: 'gradientShift 15s ease infinite',
    color: 'white',
  },
};

// Enhanced CSS animations with background effects
const style = document.createElement('style');
style.textContent = `
  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  @keyframes floatBackground {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(180deg); }
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-10px); }
    60% { transform: translateY(-5px); }
  }

  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }

  @keyframes glow {
    0%, 100% { box-shadow: 0 0 5px rgba(102, 126, 234, 0.5); }
    50% { box-shadow: 0 0 20px rgba(102, 126, 234, 0.8); }
  }

  /* Enhanced hover effects */
  .navButton:hover {
    background: rgba(102, 126, 234, 0.2) !important;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
  }

  .notificationButton:hover {
    background: rgba(255, 255, 255, 0.25) !important;
    transform: scale(1.1) rotate(5deg);
    animation: glow 1.5s infinite;
  }

  .settingsButton:hover {
    background: rgba(255, 255, 255, 0.25) !important;
    transform: scale(1.1) rotate(90deg);
  }

  .logoutButton:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 25px rgba(252, 129, 129, 0.4);
  }

  .primaryButton:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 40px rgba(102, 126, 234, 0.5);
    animation: none;
  }

  .secondaryButton:hover {
    background: rgba(255, 255, 255, 0.25) !important;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(255, 255, 255, 0.3);
  }

  .statCard:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  }

  .taskCard:hover {
    transform: translateY(-5px) scale(1.01);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
  }

  .saveButton:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(104, 211, 145, 0.4);
  }

  .testButton:hover {
    background: rgba(102, 126, 234, 0.2) !important;
    transform: translateY(-2px);
    boxShadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  }

  .closeButton:hover {
    background: rgba(255, 255, 255, 0.3) !important;
    transform: rotate(90deg);
  }

  .deleteButton:hover {
    background: rgba(252, 129, 129, 0.2) !important;
    transform: scale(1.1);
  }

  .filterButton:hover {
    background: rgba(102, 126, 234, 0.15) !important;
    transform: translateY(-1px);
  }

  .notificationItem:hover {
    background: rgba(102, 126, 234, 0.05);
    transform: translateX(5px);
  }

  /* Smooth transitions for all interactive elements */
  * {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(102, 126, 234, 0.5);
    border-radius: 10px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: rgba(102, 126, 234, 0.7);
  }

  /* Responsive design */
  @media (max-width: 768px) {
    .headerContent {
      flex-direction: column;
      gap: 1rem;
    }
    
    .navigation {
      order: 3;
      width: 100%;
      justify-content: center;
    }
    
    .welcomeSection {
      flex-direction: column;
      gap: 2rem;
    }
    
    .quickActions {
      width: 100%;
      justify-content: center;
    }
    
    .tasksGrid {
      grid-template-columns: 1fr;
    }
    
    .statsGrid {
      grid-template-columns: 1fr;
    }
  }
`;
document.head.appendChild(style);

export default Dashboard;