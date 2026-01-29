package com.todo.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.todo.dto.TodoRequest;
import com.todo.dto.TodoResponse;
import com.todo.security.JwtTokenUtil;
import com.todo.security.CustomUserDetailsService;
import com.todo.service.TodoService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class TodoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TodoService todoService;

    @MockBean
    private JwtTokenUtil jwtTokenUtil;

    @MockBean
    private CustomUserDetailsService customUserDetailsService;

    @Autowired
    private ObjectMapper objectMapper;

    private TodoResponse todoResponse;

    @BeforeEach
    void setUp() {
        todoResponse = new TodoResponse(
                1L,
                "Test Todo",
                "Test Description",
                false,
                "MEDIUM",
                null,
                LocalDateTime.now(),
                LocalDateTime.now()
        );
    }

    @Test
    @WithMockUser
    void getAllTodos_ShouldReturnTodoList() throws Exception {
        List<TodoResponse> todos = Arrays.asList(todoResponse);
        when(todoService.getAllTodos()).thenReturn(todos);

        mockMvc.perform(get("/api/todos"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Test Todo"));
    }

    @Test
    @WithMockUser
    void getTodoById_ShouldReturnTodo() throws Exception {
        when(todoService.getTodoById(anyLong())).thenReturn(todoResponse);

        mockMvc.perform(get("/api/todos/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Test Todo"));
    }

    @Test
    @WithMockUser
    void createTodo_ShouldCreateAndReturnTodo() throws Exception {
        TodoRequest request = new TodoRequest();
        request.setTitle("New Todo");
        request.setDescription("New Description");
        request.setCompleted(false);
        request.setPriority("HIGH");

        when(todoService.createTodo(any(TodoRequest.class))).thenReturn(todoResponse);

        mockMvc.perform(post("/api/todos")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());
    }

    @Test
    @WithMockUser
    void updateTodo_ShouldUpdateAndReturnTodo() throws Exception {
        TodoRequest request = new TodoRequest();
        request.setTitle("Updated Todo");
        request.setDescription("Updated Description");
        request.setCompleted(true);
        request.setPriority("LOW");

        when(todoService.updateTodo(anyLong(), any(TodoRequest.class))).thenReturn(todoResponse);

        mockMvc.perform(put("/api/todos/1")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser
    void deleteTodo_ShouldReturnNoContent() throws Exception {
        mockMvc.perform(delete("/api/todos/1").with(csrf()))
                .andExpect(status().isNoContent());
    }
}
