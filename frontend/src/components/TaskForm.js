import React, { useState, useContext, useEffect } from 'react';
import { TaskContext } from '../contexts/TaskContext';
import { AuthContext } from '../contexts/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';

const TaskForm = ({ task, onCancel }) => {
  const { addTask, updateTask } = useContext(TaskContext);
  const { userList } = useContext(AuthContext);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [assignee, setAssignee] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setDeadline(task.deadline);
      setAssignee(task.assignee);
    } else {
      setTitle('');
      setDescription('');
      setDeadline('');
      setAssignee('');
    }
  }, [task]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (task) {
      updateTask({ ...task, title, description, deadline, assignee });
      onCancel();
    } else {
      addTask({ id: Date.now(), title, description, deadline, assignee });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card p-3 mb-4">
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          required
        />
      </div>
      <div className="mb-3">
        <textarea
          className="form-control"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />
      </div>
      <div className="mb-3">
        <input
          type="date"
          className="form-control"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <select
          className="form-select"
          value={assignee}
          onChange={(e) => setAssignee(e.target.value)}
        >
          <option value="">Select Assignee</option>
          {userList.map((user) => (
            <option key={user.id} value={user.id}>
              {user.username}
            </option>
          ))}
        </select>
      </div>
      <div>
        <button type="submit" className="btn btn-primary me-2">
          {task ? 'Update Task' : 'Add Task'}
        </button>
        {task && (
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button> 
        )}
      </div>
    </form>
  );
};

export default TaskForm;