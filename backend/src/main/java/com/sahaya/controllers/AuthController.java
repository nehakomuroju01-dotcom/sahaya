package com.sahaya.controllers;

import com.sahaya.dto.AuthResponse;
import com.sahaya.dto.LoginRequest;
import com.sahaya.dto.RegisterRequest;
import com.sahaya.models.User;
import com.sahaya.services.AuthService;
import com.sahaya.services.JwtService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;

    public AuthController(
            AuthService authService,
            JwtService jwtService
    ) {
        this.authService = authService;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody RegisterRequest request
    ) {

        User user = authService.register(
                request.getName(),
                request.getEmail(),
                request.getPassword(),
                request.getRole()
        );

        String token = jwtService.generateToken(user.getEmail());

        AuthResponse response = new AuthResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.isVerified(),
                token
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request
    ) {

        User user = authService.login(
                request.getEmail(),
                request.getPassword()
        );

        String token = jwtService.generateToken(user.getEmail());

        AuthResponse response = new AuthResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.isVerified(),
                token
        );

        return ResponseEntity.ok(response);
    }
}