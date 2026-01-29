package com.todo.service;

import com.todo.dto.TodoRequest;
import com.todo.dto.TodoResponse;
import com.todo.model.Todo;
import com.todo.model.User;
import com.todo.repository.TodoRepository;
import com.todo.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TodoServiceTest {

    @Mock
    private TodoRepository todoRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private SecurityContext securityContext;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private TodoService todoService;

    private User testUser;
    private Todo testTodo;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");
        testUser.setEmail("test@example.com");

        testTodo = new Todo();
        testTodo.setId(1L);
        testTodo.setTitle("Test Todo");
        testTodo.setDescription("Test Description");
        testTodo.setCompleted(false);
        testTodo.setPriority("MEDIUM");
        testTodo.setUser(testUser);
        testTodo.setCreatedAt(LocalDateTime.now());
        testTodo.setUpdatedAt(LocalDateTime.now());

        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
        when(authentication.getName()).thenReturn("testuser");
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
    }

    @Test
    void getAllTodos_ShouldReturnAllTodosForUser() {
        List<Todo> todos = Arrays.asList(testTodo);
        when(todoRepository.findByUserId(1L)).thenReturn(todos);

        List<TodoResponse> result = todoService.getAllTodos();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Test Todo", result.get(0).getTitle());
        verify(todoRepository, times(1)).findByUserId(1L);
    }

    @Test
    void getTodoById_ShouldReturnTodo() {
        when(todoRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.of(testTodo));

        TodoResponse result = todoService.getTodoById(1L);

        assertNotNull(result);
        assertEquals("Test Todo", result.getTitle());
        verify(todoRepository, times(1)).findByIdAndUserId(1L, 1L);
    }

    @Test
    void getTodoById_ShouldThrowExceptionWhenNotFound() {
        when(todoRepository.findByIdAndUserId(anyLong(), anyLong())).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> todoService.getTodoById(999L));
    }

    @Test
    void createTodo_ShouldCreateAndReturnTodo() {
        TodoRequest request = new TodoRequest();
        request.setTitle("New Todo");
        request.setDescription("New Description");
        request.setCompleted(false);
        request.setPriority("HIGH");

        when(todoRepository.save(any(Todo.class))).thenReturn(testTodo);

        TodoResponse result = todoService.createTodo(request);

        assertNotNull(result);
        verify(todoRepository, times(1)).save(any(Todo.class));
    }

    @Test
    void updateTodo_ShouldUpdateAndReturnTodo() {
        TodoRequest request = new TodoRequest();
        request.setTitle("Updated Todo");
        request.setDescription("Updated Description");
        request.setCompleted(true);
        request.setPriority("LOW");

        when(todoRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.of(testTodo));
        when(todoRepository.save(any(Todo.class))).thenReturn(testTodo);

        TodoResponse result = todoService.updateTodo(1L, request);

        assertNotNull(result);
        verify(todoRepository, times(1)).save(any(Todo.class));
    }

    @Test
    void deleteTodo_ShouldDeleteTodo() {
        when(todoRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.of(testTodo));

        todoService.deleteTodo(1L);

        verify(todoRepository, times(1)).delete(testTodo);
    }
}
