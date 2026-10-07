package com.sahaya.controllers;

import com.sahaya.models.User;
import com.sahaya.services.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/pending-receivers")
    public ResponseEntity<List<User>> getPendingReceivers(
            Authentication authentication
    ) {

        User admin = (User) authentication.getPrincipal();

        return ResponseEntity.ok(
                adminService.getPendingReceivers(admin)
        );
    }

    @PutMapping("/verify-receiver/{receiverId}")
    public ResponseEntity<User> verifyReceiver(
            @PathVariable Long receiverId,
            Authentication authentication
    ) {

        User admin = (User) authentication.getPrincipal();

        return ResponseEntity.ok(
                adminService.verifyReceiver(
                        receiverId,
                        admin
                )
        );
    }
}