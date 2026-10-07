package com.sahaya.controllers;

import com.sahaya.dto.ClaimResponse;
import com.sahaya.dto.CreateClaimRequest;
import com.sahaya.models.User;
import com.sahaya.services.ClaimService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/claims")
public class ClaimController {

    private final ClaimService claimService;

    public ClaimController(ClaimService claimService) {
        this.claimService = claimService;
    }

    @PostMapping("/donation/{donationId}")
    public ResponseEntity<ClaimResponse> createClaim(
            @PathVariable Long donationId,
            @Valid @RequestBody CreateClaimRequest request,
            Authentication authentication
    ) {

        User receiver = (User) authentication.getPrincipal();

        ClaimResponse response =
                claimService.createClaim(
                        donationId,
                        request,
                        receiver
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping("/my")
    public ResponseEntity<List<ClaimResponse>> getMyClaims(
            Authentication authentication
    ) {

        User receiver = (User) authentication.getPrincipal();

        return ResponseEntity.ok(
                claimService.getMyClaims(receiver)
        );
    }
}