package com.sahaya.repositories;

import com.sahaya.models.Mission;
import com.sahaya.models.MissionStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MissionRepository
        extends JpaRepository<Mission, Long> {

    List<Mission> findByStatus(MissionStatus status);

    List<Mission> findByVolunteerId(Long volunteerId);

    List<Mission> findByReceiverId(Long receiverId);

    Optional<Mission> findByDonationId(Long donationId);
}