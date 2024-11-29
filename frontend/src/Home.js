import React, { useState, useEffect,useCallback } from 'react';
import axios from 'axios';
import './App.css';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import Pagination from './Pagination';

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(false);  // Loading state
  const [error, setError] = useState(null);  // Error state
  const [message, setMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);  // Editing state
  const [editTaskId, setEditTaskId] = useState(null);
  const [filter, setFilter] = useState('all');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [currentPage, setCurrentPage] = useState(1);  // Track current page
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  
  const csrfToken = Cookies.get('csrftoken');

  const startEditing = (task) => {
    setIsEditing(true);
    setEditTaskId(task.id);
    setNewTask(task.title || '');  // Populate input with the task title
    setDescription(task.description);
    setDueDate(task.due_date || '')
    setPriority(task.priority || 'medium')
  };

  const fetchTasks = useCallback( async (page=currentPage) => {
    setLoading(true); 
    try {
      const response = await axios.get(`http://localhost:8000/api/tasks/?page=${page}`, {
        headers: {
          'X-CSRFToken': csrfToken,  // Attach CSRF token
        },
        withCredentials: true,  // Include cookies
      });
      setTasks(response.data.results);
      setTotalPages(Math.ceil(response.data.count / 5)); 
      setError(null);  // Clear error
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError('Failed to fetch tasks.');  // Set error message
    } finally {
      setLoading(false);  // Set loading to false
    }
  },[csrfToken,currentPage]);

  const addTask = async () => {
    setLoading(true);
    if (newTask.trim() === '') return;
    try {
      if (isEditing) {
        await axios.patch(`http://localhost:8000/api/tasks/${editTaskId}/`, 
          { title: newTask,
            description,
            priority,
            due_date: dueDate || null , },
          {
            headers: {
              'Content-Type': 'application/json',
              'X-CSRFToken': csrfToken,
            },
            withCredentials: true,  // Ensures cookies are sent along with the request
          }
        );
        setMessage('Task updated successfully!');
      } else {
        
        await axios.post('http://localhost:8000/api/tasks/', 
          { title: newTask,
            description,
            priority,
            due_date: dueDate || null , },
          {
            headers: {
              'Content-Type': 'application/json',
              'X-CSRFToken': csrfToken,
            },
            withCredentials: true,  // Ensures cookies are sent along with the request
          }
        );
        setMessage('Task added successfully!');
      }
      setNewTask('');
      setDescription('');
      setPriority('medium');
      setDueDate('');
      setIsEditing(false);  // Reset editing state
      setCurrentPage(1)
      fetchTasks();
      setError(null);
    } catch (error) {
      console.error('Error adding/updating task:', error);
      setError('Failed to save task.');
      setMessage(null);
    } finally {
      setLoading(false);
    }
  };
  
  const deleteTask = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:8000/api/tasks/${id}/`,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
          },
          withCredentials: true,  // Ensures cookies are sent along with the request
        }
      );
      fetchTasks();
      setMessage('Task deleted successfully!');
      setError(null);
    } catch (error) {
      console.error('Error deleting task:', error);
      setError('Failed to delete task.');
      setMessage(null);
    } finally {
      setLoading(false);
    }
  };

  const toggleTaskCompletion = async (task) => {
    const updatedTask = { ...task, completed: !task.completed };
    try {
      await axios.patch(`http://localhost:8000/api/tasks/${task.id}/`, 
        updatedTask,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
          },
          withCredentials: true,  // Ensures cookies are sent along with the request
        }
      );
      fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
      setError('Failed to update task.');
    }
  };

  const filteredTasks = tasks
  .filter((task) => {
    if (filter === 'completed') return task.completed;
    if (filter === 'incomplete') return !task.completed;
    return true;  
  })
  .sort((a, b) => {
    if (sortBy === 'priority') {
      const priorityOrder = { low: 1, medium: 2, high: 3 };
      return priorityOrder[b.priority] - priorityOrder[a.priority] ; // Descending priority
    } else if (sortBy === 'due_date') {
      const dateA = a.due_date ? new Date(a.due_date) : Infinity;  // Handle null dates
      const dateB = b.due_date ? new Date(b.due_date) : Infinity;  // Push null dates to end
      return dateA - dateB; // Ascending due date
    }
    return 0; // No sorting if 'sortBy' is not specified
  });

  const handleLogout = async () => {
    try {
      await axios.post(
        'http://localhost:8000/logout/',  // Endpoint
        {},  // Empty body as no payload is required
        {
          headers: { 'X-CSRFToken': csrfToken },  // CSRF token header
          withCredentials: true,  // Include cookies for session management
        }
      );
      navigate('/'); // On successful logout, navigate to the login page
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };


  useEffect(() => {
    fetchTasks(currentPage);
  }, [fetchTasks,currentPage]);

  return (
    <div className="Home">
      <button onClick={handleLogout}>Logout</button>
      <h1>Task Manager</h1>
      <div>
        <label>Filter by Status:</label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
        <option value="all">All</option>
        <option value="completed">Completed</option>
        <option value="incomplete">Incomplete</option>
        </select>

        <label>Sort by:</label>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
        <option value="">None</option>
        <option value="priority">Priority</option>
        <option value="due_date">Due Date</option>
        </select>
      </div>
      <input
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="Add new task"
      />
      <textarea
        placeholder=" Enter Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />
      <select value={priority} onChange={(e) => setPriority(e.target.value)}>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <button onClick={addTask}>Add Task</button>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {message && <p className="message">{message}</p>}
      <ul>
        {filteredTasks.map((task) => (
          <li key={task.id} className={task.completed ? 'completed' : ''}>
            <div>
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <p>Priority: {task.priority}</p>
              <p>Due: {task.due_date || 'No due date'}</p>
            </div>
            <div>
              <button onClick={() => toggleTaskCompletion(task)}>{task.completed ? 'Undo' : 'Done'}</button>
              <button onClick={() => startEditing(task)}>Edit</button>
              <button onClick={() => deleteTask(task.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
      
    </div>
  );
};

export default Home;