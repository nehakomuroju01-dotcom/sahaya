package com.sahaya.services;

import com.sahaya.dto.ClaimResponse;
import com.sahaya.dto.CreateClaimRequest;
import com.sahaya.models.Claim;
import com.sahaya.models.Donation;
import com.sahaya.models.DonationStatus;
import com.sahaya.models.Role;
import com.sahaya.models.User;
import com.sahaya.repositories.ClaimRepository;
import com.sahaya.repositories.DonationRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ClaimService {

    private final ClaimRepository claimRepository;
    private final DonationRepository donationRepository;

    public ClaimService(
            ClaimRepository claimRepository,
            DonationRepository donationRepository
    ) {
        this.claimRepository = claimRepository;
        this.donationRepository = donationRepository;
    }

    public ClaimResponse createClaim(
            Long donationId,
            CreateClaimRequest request,
            User receiver
    ) {

        // Only receiver organizations can claim donations
        if (receiver.getRole() != Role.RECEIVER_ORG) {
            throw new RuntimeException(
                    "Only receiver organizations can claim donations"
            );
        }

        // Receiver organization must be verified
        if (!receiver.isVerified()) {
            throw new RuntimeException(
                    "Receiver organization is not verified"
            );
        }

        Donation donation = donationRepository.findById(donationId)
                .orElseThrow(() ->
                        new RuntimeException("Donation not found")
                );

        // Check expiry
        if (!donation.getExpiryDate().isAfter(LocalDateTime.now())) {
            donation.setStatus(DonationStatus.EXPIRED);
            donationRepository.save(donation);

            throw new RuntimeException(
                    "This donation has expired"
            );
        }

        // Donation must still be claimable
        if (donation.getStatus() != DonationStatus.AVAILABLE &&
                donation.getStatus() != DonationStatus.PARTIALLY_CLAIMED) {

            throw new RuntimeException(
                    "This donation is no longer available"
            );
        }

        // Calculate already claimed quantity
        int alreadyClaimed = claimRepository
                .findByDonationId(donationId)
                .stream()
                .filter(claim -> claim.getStatus().equals(
                        com.sahaya.models.ClaimStatus.ACTIVE
                ))
                .mapToInt(Claim::getQuantity)
                .sum();

        int remainingQuantity =
                donation.getQuantity() - alreadyClaimed;

        if (request.getQuantity() > remainingQuantity) {
            throw new RuntimeException(
                    "Only " + remainingQuantity +
                            " units are remaining"
            );
        }

        // Create claim
        Claim claim = new Claim();

        claim.setDonation(donation);
        claim.setReceiver(receiver);
        claim.setQuantity(request.getQuantity());

        // Update donation status
        if (request.getQuantity() == remainingQuantity) {
            donation.setStatus(DonationStatus.CLAIMED);
        } else {
            donation.setStatus(DonationStatus.PARTIALLY_CLAIMED);
        }

        donationRepository.save(donation);

        return new ClaimResponse(
                claimRepository.save(claim)
        );
    }

    public List<ClaimResponse> getMyClaims(User receiver) {

        return claimRepository
                .findByReceiverId(receiver.getId())
                .stream()
                .map(ClaimResponse::new)
                .toList();
    }
}