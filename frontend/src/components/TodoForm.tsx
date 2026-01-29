import React, { useState } from 'react';
import { TodoRequest } from '../types';

interface TodoFormProps {
  initialData?: TodoRequest;
  onSubmit: (data: TodoRequest) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

const TodoForm: React.FC<TodoFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isEditing = false,
}) => {
  const [formData, setFormData] = useState<TodoRequest>(
    initialData || {
      title: '',
      description: '',
      completed: false,
      priority: 'MEDIUM',
      dueDate: undefined,
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title.trim()) {
      onSubmit(formData);
      if (!isEditing) {
        setFormData({
          title: '',
          description: '',
          completed: false,
          priority: 'MEDIUM',
          dueDate: undefined,
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <div className="form-group">
        <label htmlFor="title">Title *</label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          maxLength={255}
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          maxLength={1000}
          rows={3}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="priority">Priority</label>
          <select
            id="priority"
            value={formData.priority}
            onChange={(e) =>
              setFormData({
                ...formData,
                priority: e.target.value as 'LOW' | 'MEDIUM' | 'HIGH',
              })
            }
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="dueDate">Due Date</label>
          <input
            type="date"
            id="dueDate"
            value={formData.dueDate ? formData.dueDate.split('T')[0] : ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                dueDate: e.target.value ? new Date(e.target.value).toISOString() : undefined,
              })
            }
          />
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-primary">
          {isEditing ? 'Update' : 'Create'} Todo
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
      </div>
    </form>
  );
};

export default TodoForm;
