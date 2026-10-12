
package com.sahaya.services;
import java.util.Objects;
import com.sahaya.dto.ClaimResponse;
import com.sahaya.dto.CreateClaimRequest;
import com.sahaya.models.Claim;
import com.sahaya.models.ClaimStatus;
import com.sahaya.models.Donation;
import com.sahaya.models.DonationStatus;
import com.sahaya.models.Role;
import com.sahaya.models.User;
import com.sahaya.repositories.ClaimRepository;
import com.sahaya.repositories.DonationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    @Transactional
    public ClaimResponse createClaim(
            Long donationId,
            CreateClaimRequest request,
            User receiver
    ) {
        if (receiver == null || receiver.getRole() != Role.RECEIVER_ORG) {
            throw new RuntimeException(
                    "Only receiver organizations can claim donations"
            );
        }

        if (!receiver.isVerified()) {
            throw new RuntimeException(
                    "Receiver organization is not verified"
            );
        }

        if (request == null || request.getQuantity() == null
                || request.getQuantity() <= 0) {
            throw new RuntimeException(
                    "Claim quantity must be greater than zero"
            );
        }

        Donation donation = donationRepository.findByIdForUpdate(donationId)
                .orElseThrow(() ->
                        new RuntimeException("Donation not found")
                );

        if (donation.getExpiryDate() == null ||
                !donation.getExpiryDate().isAfter(LocalDateTime.now())) {
            throw new RuntimeException(
                    "This donation has expired or has no valid expiry date"
            );
        }

        if (donation.getStatus() != DonationStatus.AVAILABLE &&
                donation.getStatus() != DonationStatus.PARTIALLY_CLAIMED) {
            throw new RuntimeException(
                    "This donation is no longer available"
            );
        }

        int alreadyClaimed = claimRepository
                .findByDonationId(donationId)
                .stream()
                .filter(claim -> claim.getStatus() == ClaimStatus.ACTIVE)
                .mapToInt(Claim::getQuantity)
                .sum();

        int remainingQuantity = donation.getQuantity() - alreadyClaimed;

        if (remainingQuantity <= 0) {
            throw new RuntimeException(
                    "No units remain available for claiming"
            );
        }

        if (request.getQuantity() > remainingQuantity) {
            throw new RuntimeException(
                    "Only " + remainingQuantity + " units are remaining"
            );
        }

        Claim claim = new Claim();
        claim.setDonation(donation);
        claim.setReceiver(receiver);
        claim.setQuantity(request.getQuantity());

        if (request.getQuantity() == remainingQuantity) {
            donation.setStatus(DonationStatus.CLAIMED);
        } else {
            donation.setStatus(DonationStatus.PARTIALLY_CLAIMED);
        }

        donationRepository.save(donation);
        Claim savedClaim = claimRepository.save(claim);

        return new ClaimResponse(savedClaim);
    }

    @Transactional(readOnly = true)
    public List<ClaimResponse> getMyClaims(User receiver) {
        if (receiver == null || receiver.getRole() != Role.RECEIVER_ORG) {
            throw new RuntimeException(
                    "Only receiver organizations can view their claims"
            );
        }

        return claimRepository
                .findByReceiverId(receiver.getId())
                .stream()
                .map(ClaimResponse::new)
                .toList();
    }
    @Transactional
    public ClaimResponse cancelClaim(Long claimId, User receiver) {

        if (receiver == null ||
                receiver.getRole() != Role.RECEIVER_ORG) {
            throw new RuntimeException(
                    "Only receiver organizations can cancel claims"
            );
        }

        Claim claim = claimRepository.findById(claimId)
                .orElseThrow(() ->
                        new RuntimeException("Claim not found")
                );

        // Receivers may cancel only their own claims.
        if (!Objects.equals(
                claim.getReceiver().getId(),
                receiver.getId()
        )) {
            throw new RuntimeException(
                    "You cannot cancel another receiver's claim"
            );
        }

        if (claim.getStatus() != ClaimStatus.ACTIVE) {
            throw new RuntimeException(
                    "Only active claims can be cancelled"
            );
        }

        // Lock the donation while recalculating its availability.
        Long donationId = claim.getDonation().getId();

        Donation donation = donationRepository
                .findByIdForUpdate(donationId)
                .orElseThrow(() ->
                        new RuntimeException("Donation not found")
                );

        claim.setStatus(ClaimStatus.CANCELLED);
        claimRepository.save(claim);

        int activeClaimedQuantity = claimRepository
                .findByDonationId(donationId)
                .stream()
                .filter(c -> c.getStatus() == ClaimStatus.ACTIVE)
                .mapToInt(Claim::getQuantity)
                .sum();

        int remainingQuantity =
                donation.getQuantity() - activeClaimedQuantity;

        if (remainingQuantity >= donation.getQuantity()) {
            donation.setStatus(DonationStatus.AVAILABLE);
        } else if (remainingQuantity > 0) {
            donation.setStatus(DonationStatus.PARTIALLY_CLAIMED);
        }

        donationRepository.save(donation);

        return new ClaimResponse(claim);
    }
}