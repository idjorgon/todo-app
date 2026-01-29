import React from 'react';
import { Todo, TodoRequest } from '../types';
import TodoForm from './TodoForm';

interface TodoItemProps {
  todo: Todo;
  isEditing: boolean;
  onEdit: () => void;
  onCancelEdit: () => void;
  onUpdate: (id: number, data: TodoRequest) => void;
  onDelete: (id: number) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  isEditing,
  onEdit,
  onCancelEdit,
  onUpdate,
  onDelete,
}) => {
  const handleToggleComplete = () => {
    onUpdate(todo.id, {
      title: todo.title,
      description: todo.description,
      completed: !todo.completed,
      priority: todo.priority,
      dueDate: todo.dueDate,
    });
  };

  const handleUpdate = (data: TodoRequest) => {
    onUpdate(todo.id, data);
  };

  if (isEditing) {
    return (
      <TodoForm
        initialData={{
          title: todo.title,
          description: todo.description,
          completed: todo.completed,
          priority: todo.priority,
          dueDate: todo.dueDate,
        }}
        onSubmit={handleUpdate}
        onCancel={onCancelEdit}
        isEditing
      />
    );
  }

  const priorityClass = `priority-${todo.priority.toLowerCase()}`;
  const completedClass = todo.completed ? 'completed' : '';

  return (
    <div className={`todo-item ${completedClass} ${priorityClass}`}>
      <div className="todo-main">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggleComplete}
          aria-label={`Mark ${todo.title} as ${todo.completed ? 'incomplete' : 'complete'}`}
        />
        <div className="todo-content">
          <h3>{todo.title}</h3>
          {todo.description && <p>{todo.description}</p>}
          <div className="todo-meta">
            <span className="priority-badge">{todo.priority}</span>
            {todo.dueDate && (
              <span className="due-date">
                Due: {new Date(todo.dueDate).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="todo-actions">
        <button onClick={onEdit} className="btn-edit" aria-label="Edit todo">
          Edit
        </button>
        <button
          onClick={() => onDelete(todo.id)}
          className="btn-delete"
          aria-label="Delete todo"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TodoItem;
