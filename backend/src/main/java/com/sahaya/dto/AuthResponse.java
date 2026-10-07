package com.sahaya.dto;

import com.sahaya.models.Role;

public class AuthResponse {

    private Long id;
    private String name;
    private String email;
    private Role role;
    private boolean verified;
    private String token;

    public AuthResponse() {
    }

    public AuthResponse(
            Long id,
            String name,
            String email,
            Role role,
            boolean verified,
            String token
    ) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.verified = verified;
        this.token = token;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public Role getRole() {
        return role;
    }

    public boolean isVerified() {
        return verified;
    }

    public String getToken() {
        return token;
    }
}