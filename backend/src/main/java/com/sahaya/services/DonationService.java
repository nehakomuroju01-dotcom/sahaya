package com.sahaya.services;

import com.sahaya.dto.CreateDonationRequest;
import com.sahaya.dto.DonationResponse;
import com.sahaya.models.Donation;
import com.sahaya.models.DonationStatus;
import com.sahaya.models.User;
import com.sahaya.repositories.DonationRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DonationService {

    private final DonationRepository donationRepository;

    public DonationService(DonationRepository donationRepository) {
        this.donationRepository = donationRepository;
    }

    public DonationResponse createDonation(
            CreateDonationRequest request,
            User donor
    ) {

        if (donor.getRole() != com.sahaya.models.Role.DONOR) {
            throw new RuntimeException("Only donors can create donations");
        }

        Donation donation = new Donation();

        donation.setTitle(request.getTitle());
        donation.setDescription(request.getDescription());
        donation.setType(request.getType());
        donation.setQuantity(request.getQuantity());
        donation.setPickupLocation(request.getPickupLocation());
        donation.setLatitude(request.getLatitude());
        donation.setLongitude(request.getLongitude());
        donation.setExpiryDate(request.getExpiryDate());
        donation.setStatus(DonationStatus.AVAILABLE);
        donation.setDonor(donor);

        return new DonationResponse(
                donationRepository.save(donation)
        );
    }

    public List<DonationResponse> getAvailableDonations() {

        return donationRepository
                .findByStatus(DonationStatus.AVAILABLE)
                .stream()
                .filter(donation ->
                        donation.getExpiryDate().isAfter(LocalDateTime.now()))
                .map(DonationResponse::new)
                .toList();
    }

    public List<DonationResponse> getMyDonations(User donor) {

        return donationRepository
                .findByDonorId(donor.getId())
                .stream()
                .map(DonationResponse::new)
                .toList();
    }
}