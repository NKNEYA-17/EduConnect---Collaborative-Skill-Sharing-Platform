package com.educonnect.controller;

import com.educonnect.model.User;
import com.educonnect.security.JwtService;
import com.educonnect.service.AuthService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;

    // ==============================
    // CONSTRUCTOR
    // ==============================

    public AuthController(
            AuthService authService,
            JwtService jwtService
    ) {
        this.authService = authService;
        this.jwtService = jwtService;
    }


    // ==============================
    // REGISTER
    // ==============================

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(
            @RequestBody User user
    ) {

        try {

            User registeredUser =
                    authService.registerUser(user);

            // Remove password before sending response
            registeredUser.setPassword(null);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(registeredUser);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }


    // ==============================
    // LOGIN
    // ==============================

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(
            @RequestBody User loginRequest
    ) {

        try {

            // Authenticate user using existing AuthService
            User loggedInUser =
                    authService.loginUser(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()
                    );


            // ==============================
            // GENERATE JWT TOKEN
            // ==============================

            String token =
                    jwtService.generateToken(
                            loggedInUser.getId(),
                            loggedInUser.getEmail(),
                            loggedInUser.getRole()
                    );


            // ==============================
            // REMOVE PASSWORD
            // ==============================

            loggedInUser.setPassword(null);


            // ==============================
            // CREATE LOGIN RESPONSE
            // ==============================

            Map<String, Object> response =
                    new HashMap<>();

            response.put("token", token);
            response.put("user", loggedInUser);


            return ResponseEntity.ok(response);


        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(e.getMessage());
        }
    }
}