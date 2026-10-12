
package com.sahaya.services;

import com.sahaya.repositories.DonationRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class DonationExpiryService {

    private final DonationRepository donationRepository;

    public DonationExpiryService(DonationRepository donationRepository) {
        this.donationRepository = donationRepository;
    }

    @Scheduled(fixedRate = 60000)
    @Transactional
    public void expireDonations() {
        donationRepository.expireDonationsBefore(LocalDateTime.now());
    }
}