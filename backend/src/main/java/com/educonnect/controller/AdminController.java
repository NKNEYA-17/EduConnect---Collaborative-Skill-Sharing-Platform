package com.educonnect.controller;

import com.educonnect.model.Admin;
import com.educonnect.service.AdminService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    private final AdminService adminService;

    // =========================================
    // CONSTRUCTOR
    // =========================================

    public AdminController(AdminService adminService) {

        this.adminService = adminService;

    }

    // =========================================
    // ADMIN LOGIN
    // =========================================

    @PostMapping("/login")
    public ResponseEntity<?> loginAdmin(
            @RequestBody Admin loginRequest
    ) {

        try {

            Admin loggedInAdmin =
                    adminService.loginAdmin(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()
                    );

            // Do NOT send password to frontend
            loggedInAdmin.setPassword(null);

            return ResponseEntity.ok(loggedInAdmin);

        }
        catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(e.getMessage());

        }

    }

    // =========================================
    // CREATE ADMIN
    // =========================================
    // We will use this temporarily to create
    // the two default admin accounts.
    //
    // After creating them, admins will login
    // directly using /login.
    // =========================================

    @PostMapping("/create")
    public ResponseEntity<?> createAdmin(
            @RequestBody Admin admin
    ) {

        try {

            Admin createdAdmin =
                    adminService.createAdmin(admin);

            // Do NOT send password to frontend
            createdAdmin.setPassword(null);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(createdAdmin);

        }
        catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());

        }

    }

}