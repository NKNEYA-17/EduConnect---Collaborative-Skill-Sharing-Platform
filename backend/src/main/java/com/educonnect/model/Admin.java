package com.educonnect.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "admins")
public class Admin {

    // =========================================
    // ID
    // =========================================

    @Id
    private String id;

    // =========================================
    // ADMIN DETAILS
    // =========================================

    private String name;

    private String email;

    private String password;

    // =========================================
    // ROLE
    // =========================================

    private String role;

    // =========================================
    // CREATED DATE
    // =========================================

    private LocalDateTime createdAt;

    // =========================================
    // DEFAULT CONSTRUCTOR
    // =========================================

    public Admin() {

        this.role = "ADMIN";

        this.createdAt = LocalDateTime.now();

    }

    // =========================================
    // PARAMETERIZED CONSTRUCTOR
    // =========================================

    public Admin(
            String name,
            String email,
            String password
    ) {

        this.name = name;

        this.email = email;

        this.password = password;

        this.role = "ADMIN";

        this.createdAt = LocalDateTime.now();

    }

    // =========================================
    // ID
    // =========================================

    public String getId() {

        return id;

    }

    public void setId(String id) {

        this.id = id;

    }

    // =========================================
    // NAME
    // =========================================

    public String getName() {

        return name;

    }

    public void setName(String name) {

        this.name = name;

    }

    // =========================================
    // EMAIL
    // =========================================

    public String getEmail() {

        return email;

    }

    public void setEmail(String email) {

        this.email = email;

    }

    // =========================================
    // PASSWORD
    // =========================================

    public String getPassword() {

        return password;

    }

    public void setPassword(String password) {

        this.password = password;

    }

    // =========================================
    // ROLE
    // =========================================

    public String getRole() {

        return role;

    }

    public void setRole(String role) {

        this.role = role;

    }

    // =========================================
    // CREATED AT
    // =========================================

    public LocalDateTime getCreatedAt() {

        return createdAt;

    }

    public void setCreatedAt(LocalDateTime createdAt) {

        this.createdAt = createdAt;

    }

}