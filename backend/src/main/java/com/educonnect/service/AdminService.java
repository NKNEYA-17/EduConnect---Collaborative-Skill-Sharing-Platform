package com.educonnect.service;

import com.educonnect.model.Admin;
import com.educonnect.repository.AdminRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AdminService {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;

    // =========================================
    // CONSTRUCTOR
    // =========================================

    public AdminService(
            AdminRepository adminRepository,
            PasswordEncoder passwordEncoder
    ) {

        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;

    }

    // =========================================
    // ADMIN LOGIN
    // =========================================

    public Admin loginAdmin(
            String email,
            String password
    ) {

        // Find admin by email
        Admin admin = adminRepository
                .findByEmail(email)
                .orElse(null);

        // Admin not found
        if (admin == null) {

            throw new RuntimeException(
                    "Invalid admin email or password"
            );

        }

        // Check password
        boolean passwordMatches =
                passwordEncoder.matches(
                        password,
                        admin.getPassword()
                );

        // Password incorrect
        if (!passwordMatches) {

            throw new RuntimeException(
                    "Invalid admin email or password"
            );

        }

        // Successful admin login
        return admin;
    }

    // =========================================
    // CREATE ADMIN
    // =========================================

    public Admin createAdmin(Admin admin) {

        // Check duplicate email
        if (adminRepository.existsByEmail(
                admin.getEmail()
        )) {

            throw new RuntimeException(
                    "Admin email already exists"
            );

        }

        // Set role
        admin.setRole("ADMIN");

        // Encrypt password before storing
        admin.setPassword(
                passwordEncoder.encode(
                        admin.getPassword()
                )
        );

        return adminRepository.save(admin);
    }

}