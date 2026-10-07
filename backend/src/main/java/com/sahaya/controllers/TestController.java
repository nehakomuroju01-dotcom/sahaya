package com.sahaya.controllers;

import com.sahaya.models.User;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @GetMapping("/public")
    public String publicTest() {
        return "Sahaya backend is working!";
    }

    @GetMapping("/protected")
    public String protectedTest(Authentication authentication) {

        User user = (User) authentication.getPrincipal();

        return "Authenticated successfully as: " + user.getEmail();
    }
}