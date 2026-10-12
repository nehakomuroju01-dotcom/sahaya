
package com.sahaya.repositories;

import com.sahaya.models.Need;
import com.sahaya.models.NeedStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NeedRepository extends JpaRepository<Need, Long> {
    List<Need> findByStatusOrderByCreatedAtDesc(NeedStatus status);
    List<Need> findByOrganizationIdOrderByCreatedAtDesc(Long organizationId);
}