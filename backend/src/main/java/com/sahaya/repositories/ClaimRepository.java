package com.sahaya.repositories;

import com.sahaya.models.Claim;
import com.sahaya.models.ClaimStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ClaimRepository extends JpaRepository<Claim, Long> {

    List<Claim> findByReceiverId(Long receiverId);

    List<Claim> findByDonationId(Long donationId);

    List<Claim> findByDonationIdAndStatus(
            Long donationId,
            ClaimStatus status
    );
}