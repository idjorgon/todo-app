import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchTodos, createTodo, updateTodo, deleteTodo } from '../store/todoSlice';
import { logout } from '../store/authSlice';
import { TodoRequest } from '../types';
import TodoItem from './TodoItem';
import TodoForm from './TodoForm';

const TodoList: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { todos, loading, error } = useAppSelector((state) => state.todos);
  const { user } = useAppSelector((state) => state.auth);
  const [showForm, setShowForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState<number | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleCreateTodo = async (todo: TodoRequest) => {
    await dispatch(createTodo(todo));
    setShowForm(false);
  };

  const handleUpdateTodo = async (id: number, todo: TodoRequest) => {
    await dispatch(updateTodo({ id, data: todo }));
    setEditingTodo(null);
  };

  const handleDeleteTodo = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      await dispatch(deleteTodo(id));
    }
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  return (
    <div className="todo-container">
      <header className="todo-header">
        <div>
          <h1>My Todos</h1>
          {user && <p className="user-info">Welcome, {user.username}!</p>}
        </div>
        <button onClick={handleLogout} className="btn-secondary">
          Logout
        </button>
      </header>

      {error && <div className="error-message">{error}</div>}

      <div className="todo-controls">
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Cancel' : 'Add New Todo'}
        </button>
        <div className="filter-buttons">
          <button
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={filter === 'active' ? 'active' : ''}
            onClick={() => setFilter('active')}
          >
            Active
          </button>
          <button
            className={filter === 'completed' ? 'active' : ''}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
        </div>
      </div>

      {showForm && (
        <TodoForm onSubmit={handleCreateTodo} onCancel={() => setShowForm(false)} />
      )}

      {loading && <div className="loading">Loading...</div>}

      <div className="todo-list">
        {filteredTodos.length === 0 ? (
          <p className="no-todos">No todos found. Create one to get started!</p>
        ) : (
          filteredTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              isEditing={editingTodo === todo.id}
              onEdit={() => setEditingTodo(todo.id)}
              onCancelEdit={() => setEditingTodo(null)}
              onUpdate={handleUpdateTodo}
              onDelete={handleDeleteTodo}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TodoList;
