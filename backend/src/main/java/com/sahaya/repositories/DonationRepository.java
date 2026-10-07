package com.sahaya.repositories;

import com.sahaya.models.Donation;
import com.sahaya.models.DonationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DonationRepository extends JpaRepository<Donation, Long> {

    List<Donation> findByStatus(DonationStatus status);

    List<Donation> findByDonorId(Long donorId);
}