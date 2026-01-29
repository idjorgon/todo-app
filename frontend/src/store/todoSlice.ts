import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { todoService } from '../services/todoService';
import { Todo, TodoRequest } from '../types';

interface TodoState {
  todos: Todo[];
  selectedTodo: Todo | null;
  loading: boolean;
  error: string | null;
}

const initialState: TodoState = {
  todos: [],
  selectedTodo: null,
  loading: false,
  error: null,
};

export const fetchTodos = createAsyncThunk(
  'todos/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await todoService.getAllTodos();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch todos');
    }
  }
);

export const createTodo = createAsyncThunk(
  'todos/create',
  async (todo: TodoRequest, { rejectWithValue }) => {
    try {
      return await todoService.createTodo(todo);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create todo');
    }
  }
);

export const updateTodo = createAsyncThunk(
  'todos/update',
  async ({ id, data }: { id: number; data: TodoRequest }, { rejectWithValue }) => {
    try {
      return await todoService.updateTodo(id, data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update todo');
    }
  }
);

export const deleteTodo = createAsyncThunk(
  'todos/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await todoService.deleteTodo(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete todo');
    }
  }
);

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    selectTodo: (state, action: PayloadAction<Todo | null>) => {
      state.selectedTodo = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch todos
    builder.addCase(fetchTodos.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchTodos.fulfilled, (state, action: PayloadAction<Todo[]>) => {
      state.loading = false;
      state.todos = action.payload;
    });
    builder.addCase(fetchTodos.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Create todo
    builder.addCase(createTodo.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createTodo.fulfilled, (state, action: PayloadAction<Todo>) => {
      state.loading = false;
      state.todos.push(action.payload);
    });
    builder.addCase(createTodo.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update todo
    builder.addCase(updateTodo.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateTodo.fulfilled, (state, action: PayloadAction<Todo>) => {
      state.loading = false;
      const index = state.todos.findIndex(todo => todo.id === action.payload.id);
      if (index !== -1) {
        state.todos[index] = action.payload;
      }
    });
    builder.addCase(updateTodo.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Delete todo
    builder.addCase(deleteTodo.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteTodo.fulfilled, (state, action: PayloadAction<number>) => {
      state.loading = false;
      state.todos = state.todos.filter(todo => todo.id !== action.payload);
    });
    builder.addCase(deleteTodo.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { selectTodo, clearError } = todoSlice.actions;
export default todoSlice.reducer;
