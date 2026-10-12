
package com.sahaya.controllers;

import com.sahaya.dto.CreateDonationRequest;
import com.sahaya.dto.DonationResponse;
import com.sahaya.models.User;
import com.sahaya.services.DonationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/donations")
public class DonationController {

    private final DonationService donationService;

    public DonationController(DonationService donationService) {
        this.donationService = donationService;
    }

    @PostMapping
    public ResponseEntity<DonationResponse> createDonation(
            @Valid @RequestBody CreateDonationRequest request,
            Authentication authentication
    ) {
        User donor = (User) authentication.getPrincipal();

        DonationResponse response =
                donationService.createDonation(request, donor);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping
    public ResponseEntity<List<DonationResponse>> getAvailableDonations() {
        return ResponseEntity.ok(
                donationService.getAvailableDonations()
        );
    }

    @GetMapping("/my")
    public ResponseEntity<List<DonationResponse>> getMyDonations(
            Authentication authentication
    ) {
        User donor = (User) authentication.getPrincipal();

        return ResponseEntity.ok(
                donationService.getMyDonations(donor)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<DonationResponse> getDonationById(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                donationService.getDonationById(id)
        );
    }
}
