import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { TaskContext } from '../contexts/TaskContext';
import { ThemeContext } from '../contexts/ThemeContext';
import socket from '../socket';
import styled from 'styled-components';
import TaskList from './TaskList';
import TaskForm from './TaskForm';
import 'bootstrap/dist/css/bootstrap.min.css';

const Container = styled.div`
  background: ${(props) => props.theme.background};
  color: ${(props) => props.theme.color};
  min-height: 100vh;
  padding: 20px;
`;

const TaskDashboard = () => {
  const { user, userList } = useContext(AuthContext);
  const { tasks } = useContext(TaskContext);
  const { toggleTheme } = useContext(ThemeContext);
  const [editingTask, setEditingTask] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    socket.on('notification', (message) => {
      setNotifications((prev) => [...prev, message]);
    });

    socket.on('userRemoved', () => {
      alert('You have been removed from the system.');
      window.location.reload(); // Simple logout simulation
    });

    return () => {
      socket.off('notification');
      socket.off('userRemoved');
    };
  }, []);

  const handleEdit = (task) => {
    setEditingTask(task);
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  const removeUser = (userId) => {
    socket.emit('removeUser', userId);
  };

  return (
    <Container>
      <div className="container">
        <button className="btn btn-secondary mb-4" onClick={toggleTheme}>
          Toggle Theme
        </button>
        <h1 className="mb-4">Task Dashboard</h1>
        {user.role === 'admin' && (
          <div className="card p-3 mb-4">
            <h2>Users</h2>
            <ul className="list-group">
              {userList.map((u) => (
                <li key={u.id} className="list-group-item d-flex justify-content-between align-items-center">
                  {u.username} ({u.role})
                  {u.id !== user.id && (
                    <button className="btn btn-danger btn-sm" onClick={() => removeUser(u.id)}>
                      Remove
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="card p-3 mb-4">
          <h2>Notifications</h2>
          <ul className="list-group">
            {notifications.map((notif, index) => (
              <li key={index} className="list-group-item">{notif}</li>
            ))}
          </ul>
        </div>
        {editingTask ? (
          <TaskForm task={editingTask} onCancel={handleCancelEdit} />
        ) : (
          <TaskForm />
        )}
        <TaskList tasks={tasks} onEdit={handleEdit} />
      </div>
    </Container>
  );
};

export default TaskDashboard;