package com.todo.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.todo.dto.LoginRequest;
import com.todo.dto.RegisterRequest;
import com.todo.dto.TodoRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class TodoIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private String jwtToken;

    @BeforeEach
    void setUp() throws Exception {
        // Register a test user
        RegisterRequest registerRequest = new RegisterRequest();
        registerRequest.setUsername("integrationtest" + System.currentTimeMillis());
        registerRequest.setEmail("integration" + System.currentTimeMillis() + "@test.com");
        registerRequest.setPassword("password123");

        MvcResult registerResult = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isCreated())
                .andReturn();

        String registerResponse = registerResult.getResponse().getContentAsString();
        jwtToken = objectMapper.readTree(registerResponse).get("token").asText();
    }

    @Test
    void fullTodoWorkflow_ShouldWorkEndToEnd() throws Exception {
        // Create a todo
        TodoRequest createRequest = new TodoRequest();
        createRequest.setTitle("Integration Test Todo");
        createRequest.setDescription("This is an integration test");
        createRequest.setCompleted(false);
        createRequest.setPriority("HIGH");

        MvcResult createResult = mockMvc.perform(post("/api/todos")
                        .header("Authorization", "Bearer " + jwtToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title").value("Integration Test Todo"))
                .andReturn();

        String createResponse = createResult.getResponse().getContentAsString();
        Long todoId = objectMapper.readTree(createResponse).get("id").asLong();

        // Get all todos
        mockMvc.perform(get("/api/todos")
                        .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Integration Test Todo"));

        // Get todo by ID
        mockMvc.perform(get("/api/todos/" + todoId)
                        .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Integration Test Todo"));

        // Update todo
        TodoRequest updateRequest = new TodoRequest();
        updateRequest.setTitle("Updated Integration Test Todo");
        updateRequest.setDescription("Updated description");
        updateRequest.setCompleted(true);
        updateRequest.setPriority("LOW");

        mockMvc.perform(put("/api/todos/" + todoId)
                        .header("Authorization", "Bearer " + jwtToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Updated Integration Test Todo"))
                .andExpect(jsonPath("$.completed").value(true));

        // Delete todo
        mockMvc.perform(delete("/api/todos/" + todoId)
                        .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isNoContent());

        // Verify deletion
        mockMvc.perform(get("/api/todos/" + todoId)
                        .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isBadRequest());
    }

    @Test
    void authentication_ShouldPreventUnauthorizedAccess() throws Exception {
        // Try to access todos without token - Spring Security returns 403 Forbidden for unauthenticated requests
        mockMvc.perform(get("/api/todos"))
                .andExpect(status().isForbidden());

        // Try to create todo without token
        TodoRequest request = new TodoRequest();
        request.setTitle("Unauthorized Todo");

        mockMvc.perform(post("/api/todos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden());
    }
}
