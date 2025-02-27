const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' },
});

app.use(cors());
app.use(express.json());

// Predefined users with static login
const users = [
  { id: 1, username: 'admin', password: 'admin1234', role: 'admin' },
  { id: 2, username: 'user1', password: 'password1', role: 'team_member' },
  { id: 3, username: 'user2', password: 'password2', role: 'team_member' },
];

// In-memory storage
let tasks = [];
let connectedUsers = {}; // userId -> socketId

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Handle user login
  socket.on('login', ({ username, password }) => {
    const user = users.find((u) => u.username === username && u.password === password);
    if (user) {
      socket.user = user;
      connectedUsers[user.id] = socket.id;
      const userList = users.map(({ id, username, role }) => ({ id, username, role }));
      socket.emit('loginSuccess', { user, userList });
      socket.emit('loadTasks', tasks);
    } else {
      socket.emit('loginFailure', 'Invalid credentials');
    }
  });

  // Handle adding a task
  socket.on('addTask', (task) => {
    if (socket.user) {
      tasks.push(task);
      io.emit('taskUpdated', tasks);
      if (task.assignee) {
        const assigneeSocketId = connectedUsers[task.assignee];
        if (assigneeSocketId) {
          io.to(assigneeSocketId).emit('notification', `You have been assigned a new task: ${task.title}`);
        }
      }
    }
  });

  // Handle updating a task
  socket.on('updateTask', (updatedTask) => {
    if (socket.user) {
      tasks = tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task));
      io.emit('taskUpdated', tasks);
    }
  });

  // Handle deleting a task
  socket.on('deleteTask', (taskId) => {
    if (socket.user) {
      tasks = tasks.filter((task) => task.id !== taskId);
      io.emit('taskUpdated', tasks);
    }
  });

  // Handle removing a user (admin only)
  socket.on('removeUser', (userId) => {
    if (socket.user && socket.user.role === 'admin') {
      users = users.filter((u) => u.id !== userId);
      const userList = users.map(({ id, username, role }) => ({ id, username, role }));
      io.emit('userListUpdated', userList);
      const removedSocketId = connectedUsers[userId];
      if (removedSocketId) {
        io.to(removedSocketId).emit('userRemoved');
        delete connectedUsers[userId];
      }
    }
  });

  socket.on('disconnect', () => {
    if (socket.user) {
      delete connectedUsers[socket.user.id];
    }
    console.log('User disconnected:', socket.id);
  });
});

server.listen(5000, () => console.log('Server running on port 5000'));