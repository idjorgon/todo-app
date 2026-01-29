import { render, screen, fireEvent } from '@testing-library/react';
import TodoItem from '../components/TodoItem';
import { Todo } from '../types';

const mockTodo: Todo = {
  id: 1,
  title: 'Test Todo',
  description: 'Test Description',
  completed: false,
  priority: 'MEDIUM',
  createdAt: '2024-01-01T00:00:00',
  updatedAt: '2024-01-01T00:00:00',
};

describe('TodoItem Component', () => {
  const mockOnEdit = jest.fn();
  const mockOnCancelEdit = jest.fn();
  const mockOnUpdate = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders todo item', () => {
    render(
      <TodoItem
        todo={mockTodo}
        isEditing={false}
        onEdit={mockOnEdit}
        onCancelEdit={mockOnCancelEdit}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Test Todo')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('MEDIUM')).toBeInTheDocument();
  });

  test('calls onEdit when edit button is clicked', () => {
    render(
      <TodoItem
        todo={mockTodo}
        isEditing={false}
        onEdit={mockOnEdit}
        onCancelEdit={mockOnCancelEdit}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    const editButton = screen.getByRole('button', { name: /edit todo/i });
    fireEvent.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledTimes(1);
  });

  test('calls onDelete when delete button is clicked', () => {
    render(
      <TodoItem
        todo={mockTodo}
        isEditing={false}
        onEdit={mockOnEdit}
        onCancelEdit={mockOnCancelEdit}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    const deleteButton = screen.getByRole('button', { name: /delete todo/i });
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith(1);
  });

  test('toggles completion when checkbox is clicked', () => {
    render(
      <TodoItem
        todo={mockTodo}
        isEditing={false}
        onEdit={mockOnEdit}
        onCancelEdit={mockOnCancelEdit}
        onUpdate={mockOnUpdate}
        onDelete={mockOnDelete}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(mockOnUpdate).toHaveBeenCalledWith(1, expect.objectContaining({
      completed: true,
    }));
  });
});
