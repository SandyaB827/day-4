import React, { createContext, useState, useEffect } from 'react';
import socket from '../socket';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userList, setUserList] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for stored user data on app load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
      // Re-authenticate with the server
      socket.emit('login', { username: parsedUser.username, password: parsedUser.password });
    }
  }, []);

  // Handle socket events
  useEffect(() => {
    socket.on('loginSuccess', ({ user, userList }) => {
      setUser(user);
      setUserList(userList);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(user));
    });

    socket.on('loginFailure', (message) => {
      alert(message);
    });

    socket.on('userListUpdated', (newUserList) => {
      setUserList(newUserList);
    });

    return () => {
      socket.off('loginSuccess');
      socket.off('loginFailure');
      socket.off('userListUpdated');
    };
  }, []);

  const login = (username, password) => {
    socket.emit('login', { username, password });
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    socket.disconnect();
    socket.connect(); // Reconnect for future logins
  };

  return (
    <AuthContext.Provider value={{ user, userList, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};