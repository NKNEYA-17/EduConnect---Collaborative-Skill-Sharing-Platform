package com.educonnect.service;

import com.educonnect.model.User;
import com.educonnect.repository.UserRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;


    // ==============================
    // CONSTRUCTOR
    // ==============================

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;

    }


    // ==============================
    // REGISTER USER
    // ==============================

    public User registerUser(User user) {

        // =====================================
        // CHECK DUPLICATE EMAIL
        // =====================================

        if (userRepository.existsByEmail(user.getEmail())) {

            throw new RuntimeException(
                    "Email already registered"
            );

        }


        // =====================================
        // NORMAL USERS CANNOT REGISTER AS ADMIN
        // =====================================

        user.setRole("STUDENT");


        // =====================================
        // DEFAULT MENTOR STATUS
        // =====================================

        if (
                user.getMentorStatus() == null ||
                user.getMentorStatus().isBlank()
        ) {

            user.setMentorStatus("NOT_APPLIED");

        }


        // =====================================
        // ENCRYPT PASSWORD
        // =====================================

        user.setPassword(

                passwordEncoder.encode(
                        user.getPassword()
                )

        );


        // =====================================
        // SAVE USER
        // =====================================

        return userRepository.save(user);

    }


    // ==============================
    // LOGIN USER
    // ==============================

    public User loginUser(
            String email,
            String password
    ) {

        // =====================================
        // FIND USER BY EMAIL
        // =====================================

        User user = userRepository
                .findByEmail(email)
                .orElse(null);


        // =====================================
        // USER NOT FOUND
        // =====================================

        if (user == null) {

            throw new RuntimeException(
                    "Invalid email or password"
            );

        }


        // =====================================
        // VERIFY PASSWORD
        // =====================================

        boolean passwordMatches =
                passwordEncoder.matches(
                        password,
                        user.getPassword()
                );


        if (!passwordMatches) {

            throw new RuntimeException(
                    "Invalid email or password"
            );

        }


        // =====================================
        // RETURN USER
        // =====================================

        return user;

    }

}