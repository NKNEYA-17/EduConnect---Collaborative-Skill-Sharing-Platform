package com.educonnect.controller;

import com.educonnect.model.User;
import com.educonnect.service.UserService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserService userService;

    // =========================================
    // CONSTRUCTOR
    // =========================================

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // =========================================
    // GET USER BY ID
    // =========================================

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(
            @PathVariable String id
    ) {

        try {

            User user = userService.getUserById(id);

            user.setPassword(null);

            return ResponseEntity.ok(user);

        }

        catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());

        }

    }

    // =========================================
    // UPDATE USER PROFILE
    // =========================================

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUserProfile(

            @PathVariable String id,

            @RequestBody User updatedUser

    ) {

        try {

            User updatedProfile =
                    userService.updateUserProfile(
                            id,
                            updatedUser
                    );

            updatedProfile.setPassword(null);

            return ResponseEntity.ok(updatedProfile);

        }

        catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());

        }

    }

}