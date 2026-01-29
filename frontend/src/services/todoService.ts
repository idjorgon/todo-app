import api from './api';
import { Todo, TodoRequest } from '../types';

export const todoService = {
  async getAllTodos(): Promise<Todo[]> {
    const response = await api.get<Todo[]>('/api/todos');
    return response.data;
  },

  async getTodoById(id: number): Promise<Todo> {
    const response = await api.get<Todo>(`/api/todos/${id}`);
    return response.data;
  },

  async createTodo(data: TodoRequest): Promise<Todo> {
    const response = await api.post<Todo>('/api/todos', data);
    return response.data;
  },

  async updateTodo(id: number, data: TodoRequest): Promise<Todo> {
    const response = await api.put<Todo>(`/api/todos/${id}`, data);
    return response.data;
  },

  async deleteTodo(id: number): Promise<void> {
    await api.delete(`/api/todos/${id}`);
  },

  async getTodosByStatus(completed: boolean): Promise<Todo[]> {
    const response = await api.get<Todo[]>(`/api/todos?completed=${completed}`);
    return response.data;
  },
};
