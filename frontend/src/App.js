import React, { useContext } from 'react';
import { AuthContext } from './contexts/AuthContext';
import { TaskProvider } from './contexts/TaskContext';
import Navbar from './components/Navbar';
import Login from './components/Login';
import TaskDashboard from './components/TaskDashboard';

function App() {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <TaskProvider>
      <Navbar />
      {isAuthenticated ? <TaskDashboard /> : <Login />}
    </TaskProvider>
  );
}

export default App;