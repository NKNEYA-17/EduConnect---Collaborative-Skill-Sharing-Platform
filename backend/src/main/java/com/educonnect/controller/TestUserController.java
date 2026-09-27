package com.educonnect.controller;

import com.educonnect.model.TestUser;
import com.educonnect.repository.TestUserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/test-users")
@CrossOrigin(origins = "http://localhost:5173")
public class TestUserController {

    private final TestUserRepository testUserRepository;

    public TestUserController(TestUserRepository testUserRepository) {
        this.testUserRepository = testUserRepository;
    }

    // Create a new test user
    @PostMapping
    public TestUser createUser(@RequestBody TestUser user) {
        return testUserRepository.save(user);
    }

    // Get all test users
    @GetMapping
    public List<TestUser> getAllUsers() {
        return testUserRepository.findAll();
    }
}