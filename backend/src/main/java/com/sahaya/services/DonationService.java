package com.sahaya.services;

import com.sahaya.dto.CreateDonationRequest;
import com.sahaya.dto.DonationResponse;
import com.sahaya.models.Claim;
import com.sahaya.models.ClaimStatus;
import com.sahaya.models.Donation;
import com.sahaya.models.DonationStatus;
import com.sahaya.models.DonationType;
import com.sahaya.models.Role;
import com.sahaya.models.User;
import com.sahaya.repositories.ClaimRepository;
import com.sahaya.repositories.DonationRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DonationService {

    private final DonationRepository donationRepository;
    private final ClaimRepository claimRepository;

    public DonationService(
            DonationRepository donationRepository,
            ClaimRepository claimRepository
    ) {
        this.donationRepository = donationRepository;
        this.claimRepository = claimRepository;
    }

    @Transactional
    public DonationResponse createDonation(
            CreateDonationRequest request,
            User donor
    ) {
        if (donor == null || donor.getRole() != Role.DONOR) {
            throw new RuntimeException("Only donors can create donations");
        }

        if (request.getExpiryDate() == null
                || !request.getExpiryDate().isAfter(LocalDateTime.now())) {
            throw new RuntimeException("Expiry date must be in the future");
        }

        if (request.getType() == DonationType.FOOD
                && request.getFoodPreparedAt() != null
                && request.getFoodPreparedAt().isAfter(LocalDateTime.now())) {
            throw new RuntimeException(
                    "Food preparation time cannot be in the future"
            );
        }

        Donation donation = new Donation();
        donation.setTitle(request.getTitle());
        donation.setDescription(request.getDescription());
        donation.setType(request.getType());
        donation.setQuantity(request.getQuantity());
        donation.setQuantityUnit(request.getQuantityUnit());
        donation.setPickupLocation(request.getPickupLocation());
        donation.setLatitude(request.getLatitude());
        donation.setLongitude(request.getLongitude());
        donation.setExpiryDate(request.getExpiryDate());
        donation.setStatus(DonationStatus.AVAILABLE);
        donation.setDonor(donor);

        if (request.getType() == DonationType.FOOD) {
            donation.setFoodPreparedAt(request.getFoodPreparedAt());
            donation.setAllergens(request.getAllergens());
            donation.setStorageInstructions(request.getStorageInstructions());
        } else {
            donation.setFoodPreparedAt(null);
            donation.setAllergens(null);
            donation.setStorageInstructions(null);
        }

        Donation savedDonation = donationRepository.save(donation);

        return new DonationResponse(
                savedDonation,
                true,
                savedDonation.getQuantity()
        );
    }

    @Transactional(readOnly = true)
    public List<DonationResponse> getAvailableDonations() {
        LocalDateTime now = LocalDateTime.now();

        return donationRepository.findAll()
                .stream()
                .filter(donation ->
                        (donation.getStatus() == DonationStatus.AVAILABLE
                                || donation.getStatus()
                                == DonationStatus.PARTIALLY_CLAIMED)
                                && donation.getExpiryDate() != null
                                && donation.getExpiryDate().isAfter(now)
                )
                .map(this::toDonationResponse)
                .filter(response -> response.getRemainingQuantity() > 0)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<DonationResponse> getMyDonations(User donor) {
        if (donor == null || donor.getRole() != Role.DONOR) {
            throw new RuntimeException(
                    "Only donors can view their donations"
            );
        }

        return donationRepository.findByDonorId(donor.getId())
                .stream()
                .map(donation -> toDonationResponse(donation, true))
                .toList();
    }

    @Transactional(readOnly = true)
    public DonationResponse getDonationById(Long id) {
        Donation donation = donationRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Donation not found"
                ));

        boolean active = donation.getStatus() == DonationStatus.AVAILABLE
                || donation.getStatus() == DonationStatus.PARTIALLY_CLAIMED;

        if (!active
                || donation.getExpiryDate() == null
                || !donation.getExpiryDate().isAfter(LocalDateTime.now())) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Donation not found"
            );
        }

        DonationResponse response = toDonationResponse(donation);

        if (response.getRemainingQuantity() <= 0) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "No quantity remaining for this donation"
            );
        }

        return response;
    }

    private DonationResponse toDonationResponse(Donation donation) {
        return toDonationResponse(donation, true);
    }

    private DonationResponse toDonationResponse(
            Donation donation,
            boolean includeExactLocation
    ) {
        List<Claim> activeClaims =
                claimRepository.findByDonationIdAndStatus(
                        donation.getId(),
                        ClaimStatus.ACTIVE
                );

        int claimedQuantity = activeClaims.stream()
                .mapToInt(Claim::getQuantity)
                .sum();

        int remainingQuantity = Math.max(
                0,
                donation.getQuantity() - claimedQuantity
        );

        return new DonationResponse(
                donation,
                includeExactLocation,
                remainingQuantity
        );
    }
}