package com.todo.service;

import com.todo.dto.TodoRequest;
import com.todo.dto.TodoResponse;
import com.todo.model.Todo;
import com.todo.model.User;
import com.todo.repository.TodoRepository;
import com.todo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TodoService {

    @Autowired
    private TodoRepository todoRepository;

    @Autowired
    private UserRepository userRepository;

    private User getCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private TodoResponse convertToResponse(Todo todo) {
        return new TodoResponse(
                todo.getId(),
                todo.getTitle(),
                todo.getDescription(),
                todo.getCompleted(),
                todo.getPriority(),
                todo.getDueDate(),
                todo.getCreatedAt(),
                todo.getUpdatedAt()
        );
    }

    public List<TodoResponse> getAllTodos() {
        User user = getCurrentUser();
        return todoRepository.findByUserId(user.getId())
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public TodoResponse getTodoById(Long id) {
        User user = getCurrentUser();
        Todo todo = todoRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new RuntimeException("Todo not found"));
        return convertToResponse(todo);
    }

    public TodoResponse createTodo(TodoRequest request) {
        User user = getCurrentUser();

        Todo todo = new Todo();
        todo.setTitle(request.getTitle());
        todo.setDescription(request.getDescription());
        todo.setCompleted(request.getCompleted());
        todo.setPriority(request.getPriority());
        todo.setDueDate(request.getDueDate());
        todo.setUser(user);

        Todo savedTodo = todoRepository.save(todo);
        return convertToResponse(savedTodo);
    }

    public TodoResponse updateTodo(Long id, TodoRequest request) {
        User user = getCurrentUser();
        Todo todo = todoRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new RuntimeException("Todo not found"));

        todo.setTitle(request.getTitle());
        todo.setDescription(request.getDescription());
        todo.setCompleted(request.getCompleted());
        todo.setPriority(request.getPriority());
        todo.setDueDate(request.getDueDate());

        Todo updatedTodo = todoRepository.save(todo);
        return convertToResponse(updatedTodo);
    }

    @Transactional
    public void deleteTodo(Long id) {
        User user = getCurrentUser();
        Todo todo = todoRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new RuntimeException("Todo not found"));
        todoRepository.delete(todo);
    }

    public List<TodoResponse> getTodosByStatus(Boolean completed) {
        User user = getCurrentUser();
        return todoRepository.findByUserIdAndCompleted(user.getId(), completed)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
}
