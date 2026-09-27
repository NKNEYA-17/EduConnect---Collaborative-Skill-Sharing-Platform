package com.educonnect.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.oauth2.jwt.JwtDecoder;

import org.springframework.security.web.SecurityFilterChain;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    // =========================================
    // PASSWORD ENCODER
    // =========================================

    @Bean
    public PasswordEncoder passwordEncoder() {

        return new BCryptPasswordEncoder();
    }


    // =========================================
    // SECURITY FILTER CHAIN
    // =========================================

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            JwtDecoder jwtDecoder
    ) throws Exception {

        http

            // -----------------------------------------
            // CORS
            // -----------------------------------------

            .cors(cors ->
                cors.configurationSource(
                    corsConfigurationSource()
                )
            )


            // -----------------------------------------
            // CSRF
            // -----------------------------------------

            .csrf(csrf ->
                csrf.disable()
            )


            // -----------------------------------------
            // SESSION MANAGEMENT
            // -----------------------------------------

            .sessionManagement(session ->
                session.sessionCreationPolicy(
                    SessionCreationPolicy.STATELESS
                )
            )


            // -----------------------------------------
            // REQUEST AUTHORIZATION
            // -----------------------------------------

            .authorizeHttpRequests(auth -> auth

                // Login and registration
                .requestMatchers(
                    "/api/auth/**"
                ).permitAll()


                // Admin login
                .requestMatchers(
                    "/api/admin/login"
                ).permitAll()


                // WebSocket endpoint
                .requestMatchers(
                    "/ws/**"
                ).permitAll()


                // User APIs require JWT authentication
                .requestMatchers(
                    "/api/users/**"
                ).authenticated()


                // Everything else for now
                .anyRequest().permitAll()
            )


            // -----------------------------------------
            // JWT AUTHENTICATION
            // -----------------------------------------

            .oauth2ResourceServer(
                oauth2 ->
                    oauth2.jwt(
                        jwt -> jwt.decoder(jwtDecoder)
                    )
            );


        return http.build();
    }


    // =========================================
    // CORS CONFIGURATION
    // =========================================

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
                new CorsConfiguration();


        // React frontend
        configuration.setAllowedOrigins(
            List.of(
                "http://localhost:5173"
            )
        );


        // HTTP methods
        configuration.setAllowedMethods(
            List.of(
                "GET",
                "POST",
                "PUT",
                "DELETE",
                "OPTIONS"
            )
        );


        // Headers
        configuration.setAllowedHeaders(
            List.of("*")
        );


        // Credentials
        configuration.setAllowCredentials(
            true
        );


        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();


        source.registerCorsConfiguration(
            "/**",
            configuration
        );


        return source;
    }
}