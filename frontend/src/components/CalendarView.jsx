import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CalendarView = ({ token }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDateTasks, setSelectedDateTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState('month');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [stats, setStats] = useState({});
  const [hoveredTask, setHoveredTask] = useState(null);
  const navigate = useNavigate();

  // Enhanced Professional Styles with Compact Design
  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(-45deg, #667eea, #764ba2, #f093fb, #f5576c)',
      backgroundSize: '400% 400%',
      animation: 'gradientShift 15s ease infinite',
      padding: '15px',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      position: 'relative',
      overflow: 'hidden',
    },
    
    // Dynamic Background Elements
    backgroundAnimation: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `
        radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
        radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.2) 0%, transparent 50%),
        linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 100%)
      `,
      animation: 'floatBackground 20s ease-in-out infinite',
      zIndex: 0,
    },
    
    floatingParticles: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `
        radial-gradient(2px 2px at 20% 30%, rgba(255,255,255,0.3), transparent),
        radial-gradient(2px 2px at 40% 70%, rgba(255,255,255,0.3), transparent),
        radial-gradient(2px 2px at 60% 20%, rgba(255,255,255,0.4), transparent),
        radial-gradient(3px 3px at 80% 50%, rgba(255,255,255,0.2), transparent),
        radial-gradient(2px 2px at 10% 80%, rgba(255,255,255,0.3), transparent),
        radial-gradient(3px 3px at 90% 10%, rgba(255,255,255,0.2), transparent)
      `,
      animation: 'particleFloat 25s linear infinite',
      zIndex: 1,
    },
    
    contentWrapper: {
      maxWidth: '1400px',
      margin: '0 auto',
      position: 'relative',
      zIndex: 10,
    },
    
    // Compact Header
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
      background: 'rgba(255, 255, 255, 0.95)',
      padding: '20px 25px',
      borderRadius: '16px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      backdropFilter: 'blur(20px)',
    },
    headerContent: {
      flex: 1,
    },
    headerTitle: {
      color: '#2b2d42',
      fontWeight: '800',
      fontSize: '28px',
      margin: '0 0 4px 0',
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
    headerSubtitle: {
      color: '#6c757d',
      fontSize: '14px',
      fontWeight: '500',
      margin: '0',
    },
    headerActions: {
      display: 'flex',
      gap: '12px',
      alignItems: 'center',
    },
    dashboardButton: {
      padding: '10px 20px',
      background: 'rgba(102, 126, 234, 0.1)',
      color: '#667eea',
      border: '2px solid #667eea',
      borderRadius: '10px',
      fontSize: '13px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      textDecoration: 'none',
    },
    
    // Compact Stats Overview
    statsOverview: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: '15px',
      marginBottom: '20px',
    },
    statCard: {
      background: 'rgba(255, 255, 255, 0.95)',
      padding: '18px 15px',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      backdropFilter: 'blur(10px)',
      textAlign: 'center',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
    },
    statNumber: {
      fontSize: '24px',
      fontWeight: '800',
      color: '#667eea',
      marginBottom: '4px',
    },
    statLabel: {
      fontSize: '12px',
      color: '#6c757d',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    
    // Compact Controls Section
    controlsSection: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr',
      gap: '20px',
      marginBottom: '20px',
    },
    
    calendarControls: {
      background: 'rgba(255, 255, 255, 0.95)',
      padding: '20px',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      backdropFilter: 'blur(10px)',
    },
    controlsHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '15px',
    },
    monthTitle: {
      color: '#2b2d42',
      fontWeight: '700',
      fontSize: '20px',
      margin: '0',
      background: 'linear-gradient(135deg, #2b2d42, #667eea)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
    controlsGroup: {
      display: 'flex',
      gap: '8px',
      alignItems: 'center',
    },
    viewToggle: {
      display: 'flex',
      background: 'rgba(102, 126, 234, 0.1)',
      borderRadius: '8px',
      padding: '3px',
      marginRight: '12px',
    },
    viewButton: {
      padding: '8px 16px',
      background: 'transparent',
      border: 'none',
      borderRadius: '6px',
      fontSize: '12px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      color: '#6c757d',
    },
    viewButtonActive: {
      background: '#667eea',
      color: 'white',
      boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
    },
    navButton: {
      padding: '8px 16px',
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '12px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
      minWidth: '80px',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
    },
    todayButton: {
      padding: '8px 16px',
      background: 'rgba(255, 255, 255, 0.9)',
      color: '#667eea',
      border: '2px solid #667eea',
      borderRadius: '8px',
      fontSize: '12px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      backdropFilter: 'blur(10px)',
      margin: '0 6px',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
    },
    
    // Compact Filters Panel
    filtersPanel: {
      background: 'rgba(255, 255, 255, 0.95)',
      padding: '20px',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      backdropFilter: 'blur(10px)',
    },
    filtersTitle: {
      color: '#2b2d42',
      fontWeight: '700',
      fontSize: '14px',
      margin: '0 0 15px 0',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    filterGroup: {
      marginBottom: '15px',
    },
    filterLabel: {
      display: 'block',
      color: '#6c757d',
      fontSize: '12px',
      fontWeight: '600',
      marginBottom: '6px',
    },
    searchInput: {
      width: '100%',
      padding: '10px 12px',
      border: '2px solid #e9ecef',
      borderRadius: '8px',
      fontSize: '13px',
      transition: 'all 0.3s ease',
      background: 'rgba(255, 255, 255, 0.8)',
    },
    selectInput: {
      width: '100%',
      padding: '10px 12px',
      border: '2px solid #e9ecef',
      borderRadius: '8px',
      fontSize: '13px',
      background: 'rgba(255, 255, 255, 0.8)',
      cursor: 'pointer',
    },
    
    // Compact Calendar Grid
    calendarGrid: {
      background: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '16px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
      overflow: 'hidden',
      marginBottom: '20px',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      backdropFilter: 'blur(10px)',
    },
    weekdaysHeader: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    weekday: {
      padding: '12px 8px',
      textAlign: 'center',
      fontWeight: '700',
      color: 'white',
      fontSize: '12px',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      borderRight: '1px solid rgba(255, 255, 255, 0.2)',
      textShadow: '0 1px 2px rgba(0,0,0,0.1)',
    },
    calendarWeek: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
    },
    calendarWeekLast: {
      borderBottom: 'none',
    },
    
    // Compact Calendar Days
    calendarDay: {
      padding: '8px 6px',
      minHeight: '80px',
      borderRight: '1px solid rgba(0, 0, 0, 0.05)',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative',
      background: 'rgba(255, 255, 255, 0.8)',
    },
    calendarDayLast: {
      borderRight: 'none',
    },
    calendarDayToday: {
      background: 'linear-gradient(135deg, #ebf8ff 0%, #bee3f8 100%)',
      border: '2px solid #667eea',
      boxShadow: '0 2px 8px rgba(102, 126, 234, 0.2)',
    },
    calendarDaySelected: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      transform: 'scale(1.02)',
      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
    },
    calendarDayWeekend: {
      background: 'rgba(248, 249, 250, 0.9)',
    },
    calendarDayEmpty: {
      background: 'rgba(248, 249, 250, 0.5)',
      cursor: 'default',
    },
    
    dayNumber: {
      fontSize: '13px',
      fontWeight: '700',
      marginBottom: '4px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    dayNumberToday: {
      color: '#667eea',
      fontWeight: '800',
    },
    dayNumberSelected: {
      color: 'white',
    },
    dayNumberWeekend: {
      color: '#ef476f',
    },
    
    taskIndicators: {
      display: 'flex',
      flexDirection: 'column',
      gap: '2px',
      marginTop: '4px',
    },
    taskIndicator: {
      padding: '2px 6px',
      borderRadius: '4px',
      fontSize: '9px',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    taskIndicatorLow: {
      background: 'linear-gradient(135deg, #48bb78, #38a169)',
      color: 'white',
    },
    taskIndicatorMedium: {
      background: 'linear-gradient(135deg, #ed8936, #dd6b20)',
      color: 'white',
    },
    taskIndicatorHigh: {
      background: 'linear-gradient(135deg, #f56565, #e53e3e)',
      color: 'white',
    },
    taskIndicatorMore: {
      background: 'linear-gradient(135deg, #a0aec0, #718096)',
      color: 'white',
      textAlign: 'center',
      fontSize: '8px',
      padding: '2px 4px',
    },
    
    contentGrid: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr',
      gap: '20px',
      alignItems: 'start',
    },
    
    // Compact Selected Panel
    selectedPanel: {
      background: 'rgba(255, 255, 255, 0.95)',
      padding: '20px',
      borderRadius: '16px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      backdropFilter: 'blur(10px)',
    },
    selectedHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '15px',
      paddingBottom: '12px',
      borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
    },
    selectedTitle: {
      color: '#2b2d42',
      fontWeight: '700',
      fontSize: '18px',
      margin: '0',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    selectedDateText: {
      color: '#667eea',
      fontWeight: '600',
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
    taskCount: {
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      color: 'white',
      padding: '6px 12px',
      borderRadius: '16px',
      fontSize: '12px',
      fontWeight: '700',
      boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
    },
    
    tasksList: {
      display: 'grid',
      gap: '12px',
      maxHeight: '400px',
      overflowY: 'auto',
      paddingRight: '8px',
    },
    noTasks: {
      textAlign: 'center',
      padding: '30px 15px',
      color: '#6c757d',
    },
    noTasksIcon: {
      fontSize: '32px',
      marginBottom: '12px',
      opacity: '0.5',
    },
    noTasksText: {
      fontSize: '14px',
      marginBottom: '15px',
      color: '#2b2d42',
    },
    addTaskLink: {
      color: '#667eea',
      textDecoration: 'none',
      fontWeight: '600',
      fontSize: '14px',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '8px 16px',
      border: '2px solid #667eea',
      borderRadius: '8px',
      transition: 'all 0.3s ease',
      background: 'rgba(102, 126, 234, 0.05)',
    },
    
    // Compact Task Items
    taskItem: {
      background: 'rgba(255, 255, 255, 0.9)',
      borderRadius: '12px',
      padding: '16px',
      borderLeft: '3px solid #667eea',
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      border: '1px solid rgba(0, 0, 0, 0.05)',
      backdropFilter: 'blur(5px)',
      cursor: 'pointer',
    },
    taskHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '8px',
    },
    taskTitle: {
      margin: '0',
      color: '#2b2d42',
      flex: '1',
      fontWeight: '600',
      fontSize: '14px',
      lineHeight: '1.4',
    },
    taskDescription: {
      color: '#6c757d',
      marginBottom: '12px',
      lineHeight: '1.5',
      fontSize: '13px',
    },
    taskDetails: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: '11px',
      color: '#6c757d',
      marginBottom: '8px',
      flexWrap: 'wrap',
      gap: '8px',
    },
    taskDetailItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      background: 'rgba(0, 0, 0, 0.03)',
      padding: '4px 8px',
      borderRadius: '6px',
      fontWeight: '500',
    },
    
    // Compact Upcoming Tasks Panel
    upcomingTasksPanel: {
      background: 'rgba(255, 255, 255, 0.95)',
      padding: '20px',
      borderRadius: '16px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      backdropFilter: 'blur(10px)',
    },
    upcomingHeader: {
      color: '#2b2d42',
      fontWeight: '700',
      fontSize: '16px',
      margin: '0 0 15px 0',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    upcomingList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      maxHeight: '300px',
      overflowY: 'auto',
    },
    upcomingItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '12px',
      background: 'rgba(255, 255, 255, 0.8)',
      borderRadius: '8px',
      border: '1px solid rgba(0, 0, 0, 0.05)',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
    },
    upcomingDate: {
      fontSize: '11px',
      color: '#667eea',
      fontWeight: '600',
      minWidth: '50px',
      textAlign: 'center',
    },
    upcomingTitle: {
      fontSize: '12px',
      fontWeight: '600',
      color: '#2b2d42',
      flex: 1,
    },
    
    loading: {
      textAlign: 'center',
      padding: '40px 15px',
      color: '#6c757d',
      fontSize: '16px',
      background: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '16px',
      margin: '15px 0',
    },
    loadingSpinner: {
      display: 'inline-block',
      width: '20px',
      height: '20px',
      border: '2px solid transparent',
      borderTop: '2px solid #667eea',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      marginRight: '10px',
    },
  };

  useEffect(() => {
    fetchTasks();
  }, [token]);

  useEffect(() => {
    calculateStats();
    updateUpcomingTasks();
  }, [tasks]);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const authToken = token || localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/tasks', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setTasks(data.tasks || []);
      } else {
        // Fallback mock data for demonstration
        setTasks([
          {
            _id: '1',
            title: 'Team Meeting',
            description: 'Weekly team sync meeting',
            dueDate: new Date().toISOString(),
            priority: 'high',
            status: 'pending'
          },
          {
            _id: '2',
            title: 'Project Deadline',
            description: 'Submit final project deliverables',
            dueDate: new Date(Date.now() + 86400000).toISOString(),
            priority: 'high',
            status: 'inProgress'
          },
          {
            _id: '3',
            title: 'Documentation Review',
            description: 'Review and update project documentation',
            dueDate: new Date(Date.now() + 172800000).toISOString(),
            priority: 'medium',
            status: 'pending'
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      // Fallback mock data
      setTasks([
        {
          _id: '1',
          title: 'Sample Task',
          description: 'This is a sample task for demonstration',
          dueDate: new Date().toISOString(),
          priority: 'medium',
          status: 'pending'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = () => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === 'completed').length;
    const overdueTasks = tasks.filter(task => {
      const dueDate = new Date(task.dueDate);
      return dueDate < new Date() && task.status !== 'completed';
    }).length;
    const todayTasks = tasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      const today = new Date();
      return taskDate.toDateString() === today.toDateString();
    }).length;

    setStats({
      total: totalTasks,
      completed: completedTasks,
      overdue: overdueTasks,
      today: todayTasks,
      completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
    });
  };

  const updateUpcomingTasks = () => {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    const upcoming = tasks
      .filter(task => {
        const taskDate = new Date(task.dueDate);
        return taskDate > new Date() && taskDate <= nextWeek && task.status !== 'completed';
      })
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 5);

    setUpcomingTasks(upcoming);
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
    setSelectedDate(null);
    setSelectedDateTasks([]);
  };

  const isToday = (day) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (day) => {
    return (
      selectedDate &&
      day === selectedDate.getDate() &&
      currentDate.getMonth() === selectedDate.getMonth() &&
      currentDate.getFullYear() === selectedDate.getFullYear()
    );
  };

  const isWeekend = (day) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dayOfWeek = date.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6;
  };

  const getTasksForDate = (date) => {
    let filteredTasks = tasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      return (
        taskDate.getDate() === date.getDate() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getFullYear() === date.getFullYear()
      );
    });

    // Apply filters
    if (searchTerm) {
      filteredTasks = filteredTasks.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (filterPriority !== 'all') {
      filteredTasks = filteredTasks.filter(task => task.priority === filterPriority);
    }

    if (filterStatus !== 'all') {
      filteredTasks = filteredTasks.filter(task => task.status === filterStatus);
    }

    return filteredTasks;
  };

  const handleDateClick = (day) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(date);
    const dateTasks = getTasksForDate(date);
    setSelectedDateTasks(dateTasks);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatShortDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return styles.taskIndicatorHigh;
      case 'medium': return styles.taskIndicatorMedium;
      case 'low': return styles.taskIndicatorLow;
      default: return styles.taskIndicatorMedium;
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'high': return 'High';
      case 'medium': return 'Medium';
      case 'low': return 'Low';
      default: return 'Medium';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return '✅';
      case 'inProgress': return '🔄';
      default: return '⏳';
    }
  };

  const handleTaskClick = (taskId) => {
    // Navigate to task details or edit page
    console.log('Task clicked:', taskId);
  };

  const handleAddTask = () => {
    navigate('/add-task');
  };

  const handleDashboardClick = () => {
    navigate('/dashboard');
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    if (selectedDate) {
      const dateTasks = getTasksForDate(selectedDate);
      setSelectedDateTasks(dateTasks);
    }
  };

  const handlePriorityFilterChange = (e) => {
    setFilterPriority(e.target.value);
    if (selectedDate) {
      const dateTasks = getTasksForDate(selectedDate);
      setSelectedDateTasks(dateTasks);
    }
  };

  const handleStatusFilterChange = (e) => {
    setFilterStatus(e.target.value);
    if (selectedDate) {
      const dateTasks = getTasksForDate(selectedDate);
      setSelectedDateTasks(dateTasks);
    }
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const weeks = [];
    let days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div 
          key={`empty-${i}`} 
          style={{
            ...styles.calendarDay,
            ...styles.calendarDayEmpty,
            ...(i === 6 ? styles.calendarDayLast : {})
          }}
          className="empty"
        ></div>
      );
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dateTasks = getTasksForDate(date);
      const isLastInRow = (firstDay + day) % 7 === 0 || day === daysInMonth;
      const isWeekendDay = isWeekend(day);
      
      days.push(
        <div
          key={day}
          style={{
            ...styles.calendarDay,
            ...(isToday(day) ? styles.calendarDayToday : {}),
            ...(isSelected(day) ? styles.calendarDaySelected : {}),
            ...(isWeekendDay ? styles.calendarDayWeekend : {}),
            ...(isLastInRow ? styles.calendarDayLast : {})
          }}
          onClick={() => handleDateClick(day)}
          onMouseEnter={(e) => {
            if (!e.target.classList.contains('empty')) {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 4px 16px rgba(102, 126, 234, 0.15)';
            }
          }}
          onMouseLeave={(e) => {
            if (!e.target.classList.contains('empty')) {
              e.target.style.transform = isSelected(day) ? 'scale(1.02)' : 'none';
              e.target.style.boxShadow = isSelected(day) ? styles.calendarDaySelected.boxShadow : 'none';
            }
          }}
        >
          <div style={styles.dayNumber}>
            <span style={{
              ...(isToday(day) ? styles.dayNumberToday : {}),
              ...(isSelected(day) ? styles.dayNumberSelected : {}),
              ...(isWeekendDay ? styles.dayNumberWeekend : {})
            }}>
              {day}
            </span>
            {isToday(day) && <span style={{ fontSize: '10px' }}>📍</span>}
          </div>
          {dateTasks.length > 0 && (
            <div style={styles.taskIndicators}>
              {dateTasks.slice(0, 2).map((task, index) => (
                <div 
                  key={index} 
                  style={{
                    ...styles.taskIndicator,
                    ...getPriorityColor(task.priority)
                  }}
                  title={`${task.title} - ${getPriorityLabel(task.priority)} priority`}
                >
                  {task.title.length > 10 ? task.title.substring(0, 10) + '...' : task.title}
                </div>
              ))}
              {dateTasks.length > 2 && (
                <div 
                  style={{
                    ...styles.taskIndicator,
                    ...styles.taskIndicatorMore
                  }}
                  title={`${dateTasks.length - 2} more tasks`}
                >
                  +{dateTasks.length - 2}
                </div>
              )}
            </div>
          )}
        </div>
      );

      // Start a new row every 7 days
      if ((firstDay + day) % 7 === 0 || day === daysInMonth) {
        weeks.push(
          <div 
            key={day} 
            style={{
              ...styles.calendarWeek,
              ...(day === daysInMonth ? styles.calendarWeekLast : {})
            }}
          >
            {days}
          </div>
        );
        days = [];
      }
    }

    return weeks;
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  if (isLoading) {
    return (
      <div style={styles.container}>
        <div style={styles.backgroundAnimation}></div>
        <div style={styles.floatingParticles}></div>
        <div style={styles.contentWrapper}>
          <div style={styles.loading}>
            <span style={styles.loadingSpinner}></span>
            Loading your calendar...
          </div>
        </div>
        <style>
          {`
            @keyframes gradientShift {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
            @keyframes floatBackground {
              0%, 100% { transform: translateY(0px) rotate(0deg); }
              50% { transform: translateY(-20px) rotate(180deg); }
            }
            @keyframes particleFloat {
              0% { transform: translateY(0px) translateX(0px); }
              25% { transform: translateY(-20px) translateX(10px); }
              50% { transform: translateY(0px) translateX(20px); }
              75% { transform: translateY(20px) translateX(10px); }
              100% { transform: translateY(0px) translateX(0px); }
            }
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.backgroundAnimation}></div>
      <div style={styles.floatingParticles}></div>
      
      <div style={styles.contentWrapper}>
        
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerContent}>
            <h1 style={styles.headerTitle}>Advanced Calendar</h1>
            <p style={styles.headerSubtitle}>
              Comprehensive task management with advanced filtering and analytics
            </p>
          </div>
          <div style={styles.headerActions}>
            <button 
              style={styles.dashboardButton}
              onClick={handleDashboardClick}
              onMouseEnter={(e) => {
                e.target.style.background = '#667eea';
                e.target.style.color = 'white';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = styles.dashboardButton.background;
                e.target.style.color = styles.dashboardButton.color;
                e.target.style.transform = 'none';
                e.target.style.boxShadow = 'none';
              }}
            >
              📊 Dashboard
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div style={styles.statsOverview}>
          <div 
            style={styles.statCard}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = styles.statCard.boxShadow;
            }}
          >
            <div style={styles.statNumber}>{stats.total || 0}</div>
            <div style={styles.statLabel}>Total Tasks</div>
          </div>
          <div 
            style={styles.statCard}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = styles.statCard.boxShadow;
            }}
          >
            <div style={styles.statNumber}>{stats.completed || 0}</div>
            <div style={styles.statLabel}>Completed</div>
          </div>
          <div 
            style={styles.statCard}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = styles.statCard.boxShadow;
            }}
          >
            <div style={styles.statNumber}>{stats.overdue || 0}</div>
            <div style={styles.statLabel}>Overdue</div>
          </div>
          <div 
            style={styles.statCard}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = styles.statCard.boxShadow;
            }}
          >
            <div style={styles.statNumber}>{stats.today || 0}</div>
            <div style={styles.statLabel}>Today</div>
          </div>
          <div 
            style={styles.statCard}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = styles.statCard.boxShadow;
            }}
          >
            <div style={styles.statNumber}>{stats.completionRate || 0}%</div>
            <div style={styles.statLabel}>Completion Rate</div>
          </div>
        </div>

        {/* Controls Section */}
        <div style={styles.controlsSection}>
          {/* Calendar Controls */}
          <div style={styles.calendarControls}>
            <div style={styles.controlsHeader}>
              <h2 style={styles.monthTitle}>
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <div style={styles.controlsGroup}>
                <div style={styles.viewToggle}>
                  <button 
                    style={{
                      ...styles.viewButton,
                      ...(viewMode === 'month' ? styles.viewButtonActive : {})
                    }}
                    onClick={() => handleViewModeChange('month')}
                  >
                    Month
                  </button>
                  <button 
                    style={{
                      ...styles.viewButton,
                      ...(viewMode === 'week' ? styles.viewButtonActive : {})
                    }}
                    onClick={() => handleViewModeChange('week')}
                  >
                    Week
                  </button>
                </div>
                <button 
                  style={styles.navButton}
                  onClick={() => navigateMonth(-1)}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'none';
                    e.target.style.boxShadow = styles.navButton.boxShadow;
                  }}
                >
                  ← Prev
                </button>
                <button 
                  style={styles.todayButton}
                  onClick={() => {
                    setCurrentDate(new Date());
                    setSelectedDate(null);
                    setSelectedDateTasks([]);
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#667eea';
                    e.target.style.color = 'white';
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = styles.todayButton.background;
                    e.target.style.color = styles.todayButton.color;
                    e.target.style.transform = 'none';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  📍 Today
                </button>
                <button 
                  style={styles.navButton}
                  onClick={() => navigateMonth(1)}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'none';
                    e.target.style.boxShadow = styles.navButton.boxShadow;
                  }}
                >
                  Next →
                </button>
              </div>
            </div>
          </div>

          {/* Filters Panel */}
          <div style={styles.filtersPanel}>
            <h3 style={styles.filtersTitle}>🔍 Filters & Search</h3>
            
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Search Tasks</label>
              <input
                type="text"
                placeholder="Search tasks..."
                style={styles.searchInput}
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
              />
            </div>
            
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Priority</label>
              <select 
                style={styles.selectInput}
                value={filterPriority}
                onChange={handlePriorityFilterChange}
              >
                <option value="all">All Priorities</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>
            
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Status</label>
              <select 
                style={styles.selectInput}
                value={filterStatus}
                onChange={handleStatusFilterChange}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="inProgress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div style={styles.contentGrid}>
          {/* Calendar & Selected Tasks */}
          <div>
            {/* Calendar Grid */}
            <div style={styles.calendarGrid}>
              <div style={styles.weekdaysHeader}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} style={styles.weekday}>{day}</div>
                ))}
              </div>
              {renderCalendar()}
            </div>

            {/* Selected Date Tasks */}
            {selectedDate && (
              <div style={styles.selectedPanel}>
                <div style={styles.selectedHeader}>
                  <h3 style={styles.selectedTitle}>
                    <span>📅</span>
                    Tasks for <span style={styles.selectedDateText}>{formatDate(selectedDate)}</span>
                  </h3>
                  <div style={styles.taskCount}>
                    {selectedDateTasks.length} {selectedDateTasks.length === 1 ? 'Task' : 'Tasks'}
                  </div>
                </div>
                
                {selectedDateTasks.length > 0 ? (
                  <div style={styles.tasksList}>
                    {selectedDateTasks.map(task => (
                      <div 
                        key={task._id} 
                        style={styles.taskItem}
                        onClick={() => handleTaskClick(task._id)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-3px)';
                          e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.12)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'none';
                          e.currentTarget.style.boxShadow = styles.taskItem.boxShadow;
                        }}
                      >
                        <div style={styles.taskHeader}>
                          <h4 style={styles.taskTitle}>{task.title}</h4>
                          <span style={{
                            ...styles.taskIndicator,
                            ...getPriorityColor(task.priority),
                            width: 'auto',
                            height: 'auto',
                            padding: '4px 8px',
                            fontSize: '10px',
                            textTransform: 'uppercase'
                          }}>
                            {task.priority}
                          </span>
                        </div>
                        
                        {task.description && (
                          <p style={styles.taskDescription}>{task.description}</p>
                        )}
                        
                        <div style={styles.taskDetails}>
                          <div style={styles.taskDetailItem}>
                            <span>📅</span>
                            <span>{formatShortDate(task.dueDate)}</span>
                          </div>
                          <div style={{
                            ...styles.taskDetailItem,
                            ...(task.status === 'completed' ? { color: '#48bb78', background: 'rgba(72, 187, 120, 0.1)' } :
                                task.status === 'inProgress' ? { color: '#667eea', background: 'rgba(102, 126, 234, 0.1)' } :
                                { color: '#ed8936', background: 'rgba(237, 137, 54, 0.1)' })
                          }}>
                            <span>{getStatusIcon(task.status)}</span>
                            <span>{task.status}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={styles.noTasks}>
                    <div style={styles.noTasksIcon}>📭</div>
                    <p style={styles.noTasksText}>No tasks scheduled for this date</p>
                    <button 
                      style={styles.addTaskLink}
                      onClick={handleAddTask}
                      onMouseEnter={(e) => {
                        e.target.style.background = '#667eea';
                        e.target.style.color = 'white';
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = styles.addTaskLink.background;
                        e.target.style.color = styles.addTaskLink.color;
                        e.target.style.transform = 'none';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      ➕ Add a task for this date
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Upcoming Tasks Sidebar */}
          <div style={styles.upcomingTasksPanel}>
            <h3 style={styles.upcomingHeader}>📈 Upcoming Tasks</h3>
            <div style={styles.upcomingList}>
              {upcomingTasks.length > 0 ? (
                upcomingTasks.map(task => (
                  <div 
                    key={task._id} 
                    style={styles.upcomingItem}
                    onClick={() => handleTaskClick(task._id)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(102, 126, 234, 0.05)';
                      e.currentTarget.style.transform = 'translateX(3px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = styles.upcomingItem.background;
                      e.currentTarget.style.transform = 'none';
                    }}
                  >
                    <div style={styles.upcomingDate}>
                      {formatShortDate(task.dueDate)}
                    </div>
                    <div style={styles.upcomingTitle}>
                      {task.title}
                    </div>
                    <div style={{
                      ...styles.taskIndicator,
                      ...getPriorityColor(task.priority),
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                    }}></div>
                  </div>
                ))
              ) : (
                <div style={styles.noTasks}>
                  <div style={styles.noTasksIcon}>🎉</div>
                  <p style={styles.noTasksText}>No upcoming tasks</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced CSS animations */}
      <style>
        {`
          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          @keyframes floatBackground {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
          }
          @keyframes particleFloat {
            0% { transform: translateY(0px) translateX(0px); }
            25% { transform: translateY(-20px) translateX(10px); }
            50% { transform: translateY(0px) translateX(20px); }
            75% { transform: translateY(20px) translateX(10px); }
            100% { transform: translateY(0px) translateX(0px); }
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          /* Enhanced hover effects */
          .statCard:hover {
            transform: translateY(-3px) !important;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
          }

          .navButton:hover {
            transform: translateY(-2px) !important;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4) !important;
          }

          .todayButton:hover {
            background: #667eea !important;
            color: white !important;
            transform: translateY(-2px) !important;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3) !important;
          }

          .dashboardButton:hover {
            background: #667eea !important;
            color: white !important;
            transform: translateY(-2px) !important;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3) !important;
          }

          .taskItem:hover {
            transform: translateY(-3px) !important;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12) !important;
          }

          .upcomingItem:hover {
            background: rgba(102, 126, 234, 0.05) !important;
            transform: translateX(3px) !important;
          }

          .calendarDay:hover:not(.empty) {
            transform: translateY(-2px) !important;
            box-shadow: 0 4px 16px rgba(102, 126, 234, 0.15) !important;
          }

          .addTaskLink:hover {
            background: #667eea !important;
            color: white !important;
            transform: translateY(-2px) !important;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3) !important;
          }

          /* Smooth transitions */
          * {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          }

          /* Custom scrollbar */
          ::-webkit-scrollbar {
            width: 6px;
          }

          ::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 8px;
          }

          ::-webkit-scrollbar-thumb {
            background: rgba(102, 126, 234, 0.5);
            border-radius: 8px;
          }

          ::-webkit-scrollbar-thumb:hover {
            background: rgba(102, 126, 234, 0.7);
          }
        `}
      </style>
    </div>
  );
};

export default CalendarView;