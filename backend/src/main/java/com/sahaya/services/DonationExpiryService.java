package com.sahaya.services;

import com.sahaya.models.Donation;
import com.sahaya.models.DonationStatus;
import com.sahaya.repositories.DonationRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DonationExpiryService {

    private final DonationRepository donationRepository;

    public DonationExpiryService(
            DonationRepository donationRepository
    ) {
        this.donationRepository = donationRepository;
    }

    @Scheduled(fixedRate = 60000)
    public void expireDonations() {

        LocalDateTime now = LocalDateTime.now();

        List<Donation> donations = donationRepository.findAll();

        for (Donation donation : donations) {

            boolean activeDonation =
                    donation.getStatus() == DonationStatus.AVAILABLE ||
                            donation.getStatus() == DonationStatus.PARTIALLY_CLAIMED;

            if (activeDonation &&
                    donation.getExpiryDate().isBefore(now)) {

                donation.setStatus(DonationStatus.EXPIRED);

                donationRepository.save(donation);
            }
        }
    }
}