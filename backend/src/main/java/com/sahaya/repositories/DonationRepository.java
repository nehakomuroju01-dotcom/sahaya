package com.sahaya.repositories;

import com.sahaya.models.Donation;
import com.sahaya.models.DonationStatus;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface DonationRepository extends JpaRepository<Donation, Long> {


    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.data.jpa.repository.Query("""
    UPDATE Donation d
    SET d.status = com.sahaya.models.DonationStatus.EXPIRED
    WHERE d.expiryDate < :now
      AND d.status IN (
          com.sahaya.models.DonationStatus.AVAILABLE,
          com.sahaya.models.DonationStatus.PARTIALLY_CLAIMED
      )
    """)
    int expireDonationsBefore(
            @org.springframework.data.repository.query.Param("now")
            java.time.LocalDateTime now);

    List<Donation> findByStatus(DonationStatus status);

    List<Donation> findByDonorId(Long donorId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT d FROM Donation d WHERE d.id = :donationId")
    Optional<Donation> findByIdForUpdate(@Param("donationId") Long donationId);

}
