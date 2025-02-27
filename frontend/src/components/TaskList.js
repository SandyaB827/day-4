import React, { useContext } from 'react';
import { TaskContext } from '../contexts/TaskContext';
import { AuthContext } from '../contexts/AuthContext';

const TaskList = ({ tasks, onEdit }) => {
  const { deleteTask } = useContext(TaskContext);
  const { user, userList } = useContext(AuthContext);

  const getUsername = (userId) => {
    const assignee = userList.find((u) => u.id === userId);
    return assignee ? assignee.username : 'Unknown';
  };

  return (
    <ul className="list-group">
      {tasks.map((task) => (
        <li key={task.id} className="list-group-item">
          <h5>{task.title}</h5>
          <p>{task.description}</p>
          <p>Deadline: {task.deadline}</p>
          <p>Assignee: {getUsername(task.assignee)}</p>
          {task.assignee === user.id && (
            <>
              <button className="btn btn-sm btn-info me-2" onClick={() => onEdit(task)}>
                Edit
              </button>
              <button className="btn btn-sm btn-danger" onClick={() => deleteTask(task.id)}>
                Delete
              </button>
            </>
          )}
        </li>
      ))}
    </ul>
  );
};

export default TaskList;