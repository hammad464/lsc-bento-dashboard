import { useState } from 'react';
import { CheckSquare, Plus } from 'lucide-react';
import type { Task } from '../types';

const initialTasks: Task[] = [
  { id: '1', label: 'Finish Dashboard UI', time: '10:00 AM', completed: true },
  { id: '2', label: 'Write React Logic', time: '12:00 PM', completed: false },
  { id: '3', label: 'Test & Debug', time: '3:00 PM', completed: false },
  { id: '4', label: 'Push to GitHub', time: '5:00 PM', completed: false },
];

const TaskTile = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isAdding, setIsAdding] = useState(false);
  const [newTaskLabel, setNewTaskLabel] = useState('');

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleAddTask = () => {
    const trimmed = newTaskLabel.trim();
    if (!trimmed) {
      setIsAdding(false);
      return;
    }
    const newTask: Task = {
      id: crypto.randomUUID(),
      label: trimmed,
      time: 'Unscheduled',
      completed: false,
    };
    setTasks((prev) => [...prev, newTask]);
    setNewTaskLabel('');
    setIsAdding(false);
  };

  return (
    <div className="tile task-tile">
      <div className="tile-header">
        <div className="tile-title-group">
          <span className="tile-icon-badge task-badge">
            <CheckSquare size={16} />
          </span>
          <h3>Today's Tasks</h3>
        </div>
      </div>

      <div className="task-list">
        {tasks.map((task) => (
          <button
            key={task.id}
            className={`task-item ${task.completed ? 'completed' : ''}`}
            onClick={() => toggleTask(task.id)}
          >
            <span className={`task-check ${task.completed ? 'checked' : ''}`}>
              {task.completed && <CheckSquare size={12} />}
            </span>
            <span className="task-text">
              <span className="task-label">{task.label}</span>
              <span className="task-time">{task.time}</span>
            </span>
          </button>
        ))}
      </div>

      {isAdding ? (
        <div className="task-add-form">
          <input
            autoFocus
            type="text"
            placeholder="Task name..."
            value={newTaskLabel}
            onChange={(e) => setNewTaskLabel(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
          />
          <button onClick={handleAddTask}>Add</button>
        </div>
      ) : (
        <button className="task-add-btn" onClick={() => setIsAdding(true)}>
          <Plus size={16} /> Add New Task
        </button>
      )}
    </div>
  );
};

export default TaskTile;