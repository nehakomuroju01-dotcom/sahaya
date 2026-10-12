
package com.sahaya.services;

import com.sahaya.dto.CreateNeedRequest;
import com.sahaya.dto.NeedResponse;
import com.sahaya.models.*;
import com.sahaya.repositories.NeedRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class NeedService {

    private final NeedRepository needRepository;

    public NeedService(NeedRepository needRepository) {
        this.needRepository = needRepository;
    }

    @Transactional
    public NeedResponse createNeed(CreateNeedRequest request, User organization) {
        if (organization.getRole() != Role.RECEIVER_ORG) {
            throw new RuntimeException("Only receiver organizations can post needs");
        }

        if (!organization.isVerified()) {
            throw new RuntimeException("Organization must be verified to post needs");
        }

        Need need = new Need();
        need.setTitle(request.getTitle());
        need.setDescription(request.getDescription());
        need.setType(request.getType());
        need.setQuantity(request.getQuantity());
        need.setLocation(request.getLocation());
        need.setStatus(NeedStatus.OPEN);
        need.setOrganization(organization);

        return new NeedResponse(needRepository.save(need));
    }

    @Transactional(readOnly = true)
    public List<NeedResponse> getOpenNeeds() {
        return needRepository.findByStatusOrderByCreatedAtDesc(NeedStatus.OPEN)
                .stream()
                .map(NeedResponse::new)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<NeedResponse> getMyNeeds(User organization) {
        if (organization.getRole() != Role.RECEIVER_ORG) {
            throw new RuntimeException("Only receiver organizations can view their needs");
        }

        return needRepository
                .findByOrganizationIdOrderByCreatedAtDesc(organization.getId())
                .stream()
                .map(NeedResponse::new)
                .toList();
    }
}