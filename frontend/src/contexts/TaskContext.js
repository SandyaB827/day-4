import React, { createContext, useState, useEffect } from 'react';
import socket from '../socket';

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    socket.on('loadTasks', (loadedTasks) => {
      setTasks(loadedTasks);
    });

    socket.on('taskUpdated', (updatedTasks) => {
      setTasks(updatedTasks);
    });

    return () => {
      socket.off('loadTasks');
      socket.off('taskUpdated');
    };
  }, []);

  const addTask = (task) => {
    socket.emit('addTask', task);
  };

  const updateTask = (task) => {
    socket.emit('updateTask', task);
  };

  const deleteTask = (taskId) => {
    socket.emit('deleteTask', taskId);
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, updateTask, deleteTask }}>
      {children}
    </TaskContext.Provider>
  );
};