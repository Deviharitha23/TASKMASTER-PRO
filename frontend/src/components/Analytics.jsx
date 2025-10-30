import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Analytics = () => {
  const [taskStats, setTaskStats] = useState(null);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTaskStats();
    fetchTasks();
  }, []);

  const fetchTaskStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/tasks-stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setTaskStats(data.stats);
      }
    } catch (error) {
      toast.error('Error fetching task statistics');
    }
  };

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/tasks', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setTasks(data.tasks);
      }
    } catch (error) {
      toast.error('Error fetching tasks');
    }
  };

  const calculatePriorityDistribution = () => {
    const distribution = {
      high: tasks.filter(task => task.priority === 'high').length,
      medium: tasks.filter(task => task.priority === 'medium').length,
      low: tasks.filter(task => task.priority === 'low').length
    };
    return distribution;
  };

  const calculateCompletionRate = () => {
    if (!taskStats || taskStats.total === 0) return 0;
    return Math.round((taskStats.completed / taskStats.total) * 100);
  };

  const priorityDistribution = calculatePriorityDistribution();

  return (
    <div className="analytics-view">
      <header className="analytics-header">
        <h1>Task Analytics</h1>
        <Link to="/" className="btn-secondary">Back to Dashboard</Link>
      </header>

      {taskStats ? (
        <div className="analytics-content">
          <div className="stats-overview">
            <div className="stat-card total">
              <h3>Total Tasks</h3>
              <p className="stat-number">{taskStats.total}</p>
            </div>
            <div className="stat-card completed">
              <h3>Completed</h3>
              <p className="stat-number">{taskStats.completed}</p>
            </div>
            <div className="stat-card pending">
              <h3>Pending</h3>
              <p className="stat-number">{taskStats.pending}</p>
            </div>
            <div className="stat-card in-progress">
              <h3>In Progress</h3>
              <p className="stat-number">{taskStats.inProgress}</p>
            </div>
          </div>

          <div className="charts-section">
            <div className="chart-card">
              <h3>Task Status Distribution</h3>
              <div className="pie-chart">
                <div className="chart-container">
                  <div 
                    className="chart-slice completed" 
                    style={{ 
                      flex: taskStats.completed,
                      backgroundColor: '#38a169'
                    }}
                  >
                    <span>Completed: {taskStats.completed}</span>
                  </div>
                  <div 
                    className="chart-slice pending" 
                    style={{ 
                      flex: taskStats.pending,
                      backgroundColor: '#d69e2e'
                    }}
                  >
                    <span>Pending: {taskStats.pending}</span>
                  </div>
                  <div 
                    className="chart-slice in-progress" 
                    style={{ 
                      flex: taskStats.inProgress,
                      backgroundColor: '#3182ce'
                    }}
                  >
                    <span>In Progress: {taskStats.inProgress}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="chart-card">
              <h3>Priority Distribution</h3>
              <div className="bar-chart">
                <div className="bar-container">
                  <div className="bar-item">
                    <span className="bar-label">High</span>
                    <div className="bar">
                      <div 
                        className="bar-fill high" 
                        style={{ width: `${(priorityDistribution.high / tasks.length) * 100}%` }}
                      ></div>
                    </div>
                    <span className="bar-value">{priorityDistribution.high}</span>
                  </div>
                  <div className="bar-item">
                    <span className="bar-label">Medium</span>
                    <div className="bar">
                      <div 
                        className="bar-fill medium" 
                        style={{ width: `${(priorityDistribution.medium / tasks.length) * 100}%` }}
                      ></div>
                    </div>
                    <span className="bar-value">{priorityDistribution.medium}</span>
                  </div>
                  <div className="bar-item">
                    <span className="bar-label">Low</span>
                    <div className="bar">
                      <div 
                        className="bar-fill low" 
                        style={{ width: `${(priorityDistribution.low / tasks.length) * 100}%` }}
                      ></div>
                    </div>
                    <span className="bar-value">{priorityDistribution.low}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="completion-rate">
            <h3>Overall Completion Rate</h3>
            <div className="completion-container">
              <div 
                className="completion-bar"
                style={{ width: `${calculateCompletionRate()}%` }}
              >
                {calculateCompletionRate()}%
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p>Loading analytics...</p>
      )}
    </div>
  );
};

export default Analytics;