import React, { useState, useEffect } from 'react';

const AnalyticsView = ({ token }) => {
  const [stats, setStats] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('all'); // all, week, month

  // Professional Internal CSS Styles
  const styles = {
    // Main container
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '30px 20px',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    },
    
    // Glass morphism wrapper
    contentWrapper: {
      maxWidth: '1400px',
      margin: '0 auto',
    },
    
    // Header section
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '40px',
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      padding: '30px 40px',
      borderRadius: '24px',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
    },
    headerTitle: {
      color: '#1a202c',
      fontWeight: '800',
      fontSize: '42px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      margin: '0',
    },
    headerSubtitle: {
      color: '#718096',
      fontSize: '18px',
      fontWeight: '500',
      margin: '8px 0 0 0',
    },
    
    // Time range filter
    timeFilter: {
      display: 'flex',
      gap: '12px',
      marginBottom: '30px',
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      padding: '20px 30px',
      borderRadius: '16px',
      boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
    },
    timeFilterButton: {
      padding: '12px 24px',
      background: 'rgba(255, 255, 255, 0.8)',
      color: '#667eea',
      border: '2px solid #667eea',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    timeFilterButtonActive: {
      background: 'linear-gradient(135deg, #667eea 0%, #5a67d8 100%)',
      color: 'white',
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
    },
    
    // Stats overview
    statsOverview: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '24px',
      marginBottom: '40px',
    },
    statCard: {
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      padding: '30px',
      borderRadius: '20px',
      boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      textAlign: 'center',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative',
      overflow: 'hidden',
    },
    statCardHover: {
      transform: 'translateY(-5px)',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    },
    statIcon: {
      fontSize: '48px',
      marginBottom: '16px',
    },
    statNumber: {
      fontSize: '42px',
      fontWeight: '800',
      margin: '0 0 8px 0',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
    statLabel: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#718096',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      margin: '0',
    },
    statTrend: {
      fontSize: '14px',
      fontWeight: '600',
      marginTop: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '4px',
    },
    trendPositive: {
      color: '#38a169',
    },
    trendNegative: {
      color: '#e53e3e',
    },
    
    // Charts section
    chartsSection: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
      gap: '30px',
      marginBottom: '40px',
    },
    chartCard: {
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      padding: '35px 30px',
      borderRadius: '20px',
      boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
    },
    chartHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '25px',
    },
    chartTitle: {
      color: '#2d3748',
      fontWeight: '700',
      fontSize: '22px',
      margin: '0',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    
    // Progress bars
    progressBar: {
      width: '100%',
      height: '12px',
      background: 'rgba(0, 0, 0, 0.05)',
      borderRadius: '10px',
      overflow: 'hidden',
      margin: '8px 0',
    },
    progressFill: {
      height: '100%',
      borderRadius: '10px',
      transition: 'width 1s ease-in-out',
    },
    
    // Priority distribution
    priorityDistribution: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    },
    priorityItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
    },
    priorityColor: {
      width: '16px',
      height: '16px',
      borderRadius: '50%',
      flexShrink: 0,
    },
    priorityLabel: {
      flex: '1',
      fontWeight: '600',
      color: '#2d3748',
      fontSize: '14px',
    },
    priorityValue: {
      fontWeight: '700',
      color: '#667eea',
      fontSize: '16px',
    },
    
    // Completion chart
    completionChart: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '200px',
      position: 'relative',
    },
    completionCircle: {
      width: '160px',
      height: '160px',
      borderRadius: '50%',
      background: 'conic-gradient(#38a169 0% var(--completion-percent), #e2e8f0 var(--completion-percent) 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    },
    completionInner: {
      width: '120px',
      height: '120px',
      borderRadius: '50%',
      background: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
    },
    completionPercent: {
      fontSize: '32px',
      fontWeight: '800',
      color: '#2d3748',
      margin: '0',
    },
    completionLabel: {
      fontSize: '14px',
      color: '#718096',
      margin: '0',
    },
    
    // Task insights
    insightsSection: {
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      padding: '35px 40px',
      borderRadius: '20px',
      boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
    },
    insightsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '25px',
    },
    insightCard: {
      background: 'rgba(255, 255, 255, 0.8)',
      padding: '25px',
      borderRadius: '16px',
      border: '1px solid rgba(0, 0, 0, 0.05)',
      transition: 'all 0.3s ease',
    },
    insightCardHover: {
      transform: 'translateY(-3px)',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    },
    insightIcon: {
      fontSize: '32px',
      marginBottom: '16px',
    },
    insightTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#2d3748',
      margin: '0 0 12px 0',
    },
    insightValue: {
      fontSize: '28px',
      fontWeight: '800',
      color: '#667eea',
      margin: '0 0 8px 0',
    },
    insightDescription: {
      fontSize: '14px',
      color: '#718096',
      margin: '0',
      lineHeight: '1.5',
    },
    
    // Loading state
    loading: {
      textAlign: 'center',
      padding: '100px 20px',
      color: '#718096',
      fontSize: '18px',
    },
    loadingSpinner: {
      display: 'inline-block',
      width: '32px',
      height: '32px',
      border: '4px solid transparent',
      borderTop: '4px solid #667eea',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      marginRight: '16px',
    },
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, [token, timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch tasks
      const tasksResponse = await fetch('http://localhost:5000/api/tasks', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (tasksResponse.ok) {
        const tasksData = await tasksResponse.json();
        if (tasksData.success) {
          setTasks(tasksData.tasks);
        }
      }
      
      // Fetch stats
      const statsResponse = await fetch('http://localhost:5000/api/tasks-stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        if (statsData.success) {
          setStats(statsData.stats);
        }
      }
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate additional analytics
  const calculateAnalytics = () => {
    if (!tasks.length || !stats) return null;

    const now = new Date();
    const filteredTasks = tasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      switch (timeRange) {
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return taskDate >= weekAgo;
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          return taskDate >= monthAgo;
        default:
          return true;
      }
    });

    // Priority distribution
    const priorityCounts = {
      high: filteredTasks.filter(task => task.priority === 'high').length,
      medium: filteredTasks.filter(task => task.priority === 'medium').length,
      low: filteredTasks.filter(task => task.priority === 'low').length,
    };

    // Status distribution
    const statusCounts = {
      completed: filteredTasks.filter(task => task.status === 'completed').length,
      'in-progress': filteredTasks.filter(task => task.status === 'in-progress').length,
      pending: filteredTasks.filter(task => task.status === 'pending').length,
    };

    // Average completion time (for completed tasks)
    const completedTasks = filteredTasks.filter(task => task.status === 'completed');
    const avgCompletionTime = completedTasks.length > 0 
      ? completedTasks.reduce((sum, task) => sum + task.duration, 0) / completedTasks.length 
      : 0;

    // Overdue tasks
    const overdueTasks = filteredTasks.filter(task => 
      new Date(task.dueDate) < now && task.status !== 'completed'
    );

    // Productivity score (based on completion rate and priority completion)
    const completionRate = filteredTasks.length > 0 
      ? (statusCounts.completed / filteredTasks.length) * 100 
      : 0;

    const highPriorityCompleted = filteredTasks.filter(task => 
      task.priority === 'high' && task.status === 'completed'
    ).length;

    const productivityScore = filteredTasks.length > 0
      ? ((completionRate * 0.7) + ((highPriorityCompleted / Math.max(priorityCounts.high, 1)) * 30))
      : 0;

    return {
      filteredTasks,
      priorityCounts,
      statusCounts,
      avgCompletionTime: Math.round(avgCompletionTime),
      overdueTasks: overdueTasks.length,
      completionRate: Math.round(completionRate),
      productivityScore: Math.round(productivityScore),
      totalTasks: filteredTasks.length,
    };
  };

  const analytics = calculateAnalytics();

  // Interactive effects
  const handleStatCardMouseEnter = (e) => {
    e.currentTarget.style.transform = styles.statCardHover.transform;
    e.currentTarget.style.boxShadow = styles.statCardHover.boxShadow;
  };

  const handleStatCardMouseLeave = (e) => {
    e.currentTarget.style.transform = 'none';
    e.currentTarget.style.boxShadow = styles.statCard.boxShadow;
  };

  const handleInsightCardMouseEnter = (e) => {
    e.currentTarget.style.transform = styles.insightCardHover.transform;
    e.currentTarget.style.boxShadow = styles.insightCardHover.boxShadow;
  };

  const handleInsightCardMouseLeave = (e) => {
    e.currentTarget.style.transform = 'none';
    e.currentTarget.style.boxShadow = 'none';
  };

  const handleTimeFilterClick = (range) => {
    setTimeRange(range);
  };

  if (isLoading) {
    return (
      <div style={styles.container}>
        <div style={styles.contentWrapper}>
          <div style={styles.loading}>
            <span style={styles.loadingSpinner}></span>
            Loading your analytics...
          </div>
        </div>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  if (!stats || !analytics) {
    return (
      <div style={styles.container}>
        <div style={styles.contentWrapper}>
          <div style={styles.loading}>
            No analytics data available. Start creating tasks to see insights!
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.contentWrapper}>
        
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.headerTitle}>Task Analytics</h1>
            <p style={styles.headerSubtitle}>
              Gain insights into your productivity and task management
            </p>
          </div>
        </div>

        {/* Time Range Filter */}
        <div style={styles.timeFilter}>
          {['all', 'month', 'week'].map(range => (
            <button
              key={range}
              style={{
                ...styles.timeFilterButton,
                ...(timeRange === range ? styles.timeFilterButtonActive : {})
              }}
              onClick={() => handleTimeFilterClick(range)}
            >
              {range === 'all' ? 'All Time' : range === 'month' ? 'Last 30 Days' : 'Last 7 Days'}
            </button>
          ))}
        </div>

        {/* Stats Overview */}
        <div style={styles.statsOverview}>
          <div 
            style={styles.statCard}
            onMouseEnter={handleStatCardMouseEnter}
            onMouseLeave={handleStatCardMouseLeave}
          >
            <div style={styles.statIcon}>📊</div>
            <h3 style={styles.statNumber}>{analytics.totalTasks}</h3>
            <p style={styles.statLabel}>Total Tasks</p>
            <div style={{...styles.statTrend, ...styles.trendPositive}}>
              ↗ {analytics.filteredTasks.length} in selected period
            </div>
          </div>

          <div 
            style={styles.statCard}
            onMouseEnter={handleStatCardMouseEnter}
            onMouseLeave={handleStatCardMouseLeave}
          >
            <div style={styles.statIcon}>✅</div>
            <h3 style={styles.statNumber}>{analytics.statusCounts.completed}</h3>
            <p style={styles.statLabel}>Completed</p>
            <div style={{...styles.statTrend, ...styles.trendPositive}}>
              {analytics.completionRate}% completion rate
            </div>
          </div>

          <div 
            style={styles.statCard}
            onMouseEnter={handleStatCardMouseEnter}
            onMouseLeave={handleStatCardMouseLeave}
          >
            <div style={styles.statIcon}>⏰</div>
            <h3 style={styles.statNumber}>{analytics.overdueTasks}</h3>
            <p style={styles.statLabel}>Overdue</p>
            <div style={{
              ...styles.statTrend,
              ...(analytics.overdueTasks > 0 ? styles.trendNegative : styles.trendPositive)
            }}>
              {analytics.overdueTasks > 0 ? '⚠️ Needs attention' : '🎉 All caught up'}
            </div>
          </div>

          <div 
            style={styles.statCard}
            onMouseEnter={handleStatCardMouseEnter}
            onMouseLeave={handleStatCardMouseLeave}
          >
            <div style={styles.statIcon}>🚀</div>
            <h3 style={styles.statNumber}>{analytics.productivityScore}</h3>
            <p style={styles.statLabel}>Productivity Score</p>
            <div style={{
              ...styles.statTrend,
              ...(analytics.productivityScore > 70 ? styles.trendPositive : 
                   analytics.productivityScore > 40 ? { color: '#d69e2e' } : styles.trendNegative)
            }}>
              {analytics.productivityScore > 70 ? 'Excellent!' : 
               analytics.productivityScore > 40 ? 'Good progress' : 'Needs improvement'}
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div style={styles.chartsSection}>
          {/* Priority Distribution */}
          <div style={styles.chartCard}>
            <div style={styles.chartHeader}>
              <h3 style={styles.chartTitle}>🎯 Priority Distribution</h3>
            </div>
            <div style={styles.priorityDistribution}>
              {[
                { label: 'High Priority', value: analytics.priorityCounts.high, color: '#e53e3e' },
                { label: 'Medium Priority', value: analytics.priorityCounts.medium, color: '#3182ce' },
                { label: 'Low Priority', value: analytics.priorityCounts.low, color: '#38a169' }
              ].map((priority, index) => (
                <div key={index} style={styles.priorityItem}>
                  <div style={{...styles.priorityColor, background: priority.color}}></div>
                  <span style={styles.priorityLabel}>{priority.label}</span>
                  <div style={{...styles.progressBar, flex: 2}}>
                    <div 
                      style={{
                        ...styles.progressFill,
                        background: priority.color,
                        width: `${(priority.value / Math.max(analytics.totalTasks, 1)) * 100}%`
                      }}
                    ></div>
                  </div>
                  <span style={styles.priorityValue}>{priority.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Completion Rate */}
          <div style={styles.chartCard}>
            <div style={styles.chartHeader}>
              <h3 style={styles.chartTitle}>📈 Completion Progress</h3>
            </div>
            <div style={styles.completionChart}>
              <div 
                style={{
                  ...styles.completionCircle,
                  '--completion-percent': `${analytics.completionRate}%`
                }}
              >
                <div style={styles.completionInner}>
                  <h4 style={styles.completionPercent}>{analytics.completionRate}%</h4>
                  <p style={styles.completionLabel}>Completed</p>
                </div>
              </div>
            </div>
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <p style={{ color: '#718096', margin: '0' }}>
                {analytics.statusCounts.completed} of {analytics.totalTasks} tasks completed
              </p>
            </div>
          </div>
        </div>

        {/* Task Insights */}
        <div style={styles.insightsSection}>
          <div style={styles.chartHeader}>
            <h3 style={styles.chartTitle}>💡 Task Insights</h3>
          </div>
          <div style={styles.insightsGrid}>
            <div 
              style={styles.insightCard}
              onMouseEnter={handleInsightCardMouseEnter}
              onMouseLeave={handleInsightCardMouseLeave}
            >
              <div style={styles.insightIcon}>⏱️</div>
              <h4 style={styles.insightTitle}>Average Task Duration</h4>
              <h3 style={styles.insightValue}>{analytics.avgCompletionTime}m</h3>
              <p style={styles.insightDescription}>
                Average time spent per completed task
              </p>
            </div>

            <div 
              style={styles.insightCard}
              onMouseEnter={handleInsightCardMouseEnter}
              onMouseLeave={handleInsightCardMouseLeave}
            >
              <div style={styles.insightIcon}>🔥</div>
              <h4 style={styles.insightTitle}>In Progress Tasks</h4>
              <h3 style={styles.insightValue}>{analytics.statusCounts['in-progress']}</h3>
              <p style={styles.insightDescription}>
                Tasks currently being worked on
              </p>
            </div>

            <div 
              style={styles.insightCard}
              onMouseEnter={handleInsightCardMouseEnter}
              onMouseLeave={handleInsightCardMouseLeave}
            >
              <div style={styles.insightIcon}>📅</div>
              <h4 style={styles.insightTitle}>Pending Tasks</h4>
              <h3 style={styles.insightValue}>{analytics.statusCounts.pending}</h3>
              <p style={styles.insightDescription}>
                Tasks waiting to be started
              </p>
            </div>

            <div 
              style={styles.insightCard}
              onMouseEnter={handleInsightCardMouseEnter}
              onMouseLeave={handleInsightCardMouseLeave}
            >
              <div style={styles.insightIcon}>🎯</div>
              <h4 style={styles.insightTitle}>High Priority Focus</h4>
              <h3 style={styles.insightValue}>
                {analytics.priorityCounts.high > 0 
                  ? Math.round((analytics.priorityCounts.high / analytics.totalTasks) * 100) 
                  : 0}%
              </h3>
              <p style={styles.insightDescription}>
                Percentage of high priority tasks
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add CSS animation for spinner */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default AnalyticsView;