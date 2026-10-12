
package com.sahaya.repositories;

import com.sahaya.models.Mission;
import com.sahaya.models.MissionStatus;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface MissionRepository extends JpaRepository<Mission, Long> {

    List<Mission> findByStatus(MissionStatus status);

    List<Mission> findByVolunteerId(Long volunteerId);

    List<Mission> findByReceiverId(Long receiverId);

    Optional<Mission> findByDonationId(Long donationId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT m FROM Mission m WHERE m.id = :missionId")
    Optional<Mission> findByIdForUpdate(@Param("missionId") Long missionId);
}