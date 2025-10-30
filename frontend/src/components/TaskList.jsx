import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

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
      } else {
        toast.error('Failed to fetch tasks');
      }
    } catch (error) {
      toast.error('Error fetching tasks');
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('Task deleted successfully');
        fetchTasks(); // Refresh the task list
      } else {
        toast.error('Failed to delete task');
      }
    } catch (error) {
      toast.error('Error deleting task');
    }
  };

  const updateTaskStatus = async (taskId, status) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('Task updated successfully');
        fetchTasks(); // Refresh the task list
      } else {
        toast.error('Failed to update task');
      }
    } catch (error) {
      toast.error('Error updating task');
    }
  };

  if (loading) {
    return <div className="loading">Loading tasks...</div>;
  }

  return (
    <div className="task-list">
      <h3>Your Tasks</h3>
      
      {tasks.length === 0 ? (
        <p className="no-tasks">You don't have any tasks yet. Create your first task!</p>
      ) : (
        <div className="tasks">
          {tasks.map(task => (
            <div key={task._id} className="task-card">
              <div className="task-header">
                <h4>{task.title}</h4>
                <span className={`priority ${task.priority}`}>
                  {task.priority}
                </span>
              </div>
              
              {task.description && (
                <p className="task-description">{task.description}</p>
              )}
              
              <div className="task-details">
                <div className="task-duration">
                  Duration: {task.duration} minutes
                </div>
                <div className={`task-status ${task.status}`}>
                  Status: {task.status}
                </div>
              </div>
              
              <div className="task-actions">
                <select 
                  value={task.status} 
                  onChange={(e) => updateTaskStatus(task._id, e.target.value)}
                  className="status-select"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
                
                <button 
                  onClick={() => deleteTask(task._id)}
                  className="btn-danger"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;