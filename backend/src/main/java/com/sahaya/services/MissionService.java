
package com.sahaya.services;

import com.sahaya.dto.CreateMissionRequest;
import com.sahaya.dto.MissionResponse;
import com.sahaya.models.Claim;
import com.sahaya.models.ClaimStatus;
import com.sahaya.models.Donation;
import com.sahaya.models.DonationStatus;
import com.sahaya.models.Mission;
import com.sahaya.models.MissionStatus;
import com.sahaya.models.Role;
import com.sahaya.models.User;
import com.sahaya.repositories.ClaimRepository;
import com.sahaya.repositories.DonationRepository;
import com.sahaya.repositories.MissionRepository;
import com.sahaya.repositories.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class MissionService {

    private final MissionRepository missionRepository;
    private final DonationRepository donationRepository;
    private final UserRepository userRepository;
    private final ClaimRepository claimRepository;

    public MissionService(
            MissionRepository missionRepository,
            DonationRepository donationRepository,
            UserRepository userRepository,
            ClaimRepository claimRepository) {
        this.missionRepository = missionRepository;
        this.donationRepository = donationRepository;
        this.userRepository = userRepository;
        this.claimRepository = claimRepository;
    }

    @Transactional(readOnly = true)
    public String getHandoverCode(Long missionId, User volunteer) {
        requireVolunteer(volunteer);

        Mission mission = missionRepository.findById(missionId)
                .orElseThrow(() -> new RuntimeException("Mission not found"));

        requireAssignedVolunteer(mission, volunteer);

        if (mission.getStatus() != MissionStatus.PICKED_UP) {
            throw new RuntimeException("Mission must be picked up first");
        }

        if (mission.getHandoverCode() == null) {
            throw new RuntimeException("Handover code is not available");
        }

        return mission.getHandoverCode();
    }

    @Transactional
    public MissionResponse createMission(
            CreateMissionRequest request, User receiver) {

        requireVerifiedReceiver(receiver);

        Donation donation = donationRepository.findByIdForUpdate(
                request.getDonationId()
        ).orElseThrow(() -> new RuntimeException("Donation not found"));

        if (donation.getStatus() != DonationStatus.CLAIMED &&
                donation.getStatus() != DonationStatus.PARTIALLY_CLAIMED) {
            throw new RuntimeException("Donation is not ready for pickup");
        }

        User requestedReceiver = userRepository.findById(
                request.getReceiverId()
        ).orElseThrow(() -> new RuntimeException("Receiver not found"));

        if (requestedReceiver.getRole() != Role.RECEIVER_ORG ||
                !requestedReceiver.isVerified()) {
            throw new RuntimeException(
                    "Selected user is not a verified receiver organization");
        }

        if (!requestedReceiver.getId().equals(receiver.getId())) {
            throw new RuntimeException(
                    "You can only create missions for your own organization");
        }

        boolean hasActiveClaim = claimRepository
                .findByDonationId(donation.getId())
                .stream()
                .anyMatch(claim ->
                        claim.getReceiver() != null &&
                                claim.getReceiver().getId().equals(receiver.getId()) &&
                                claim.getStatus() == ClaimStatus.ACTIVE);

        if (!hasActiveClaim) {
            throw new RuntimeException(
                    "Your organization must have an active claim for this donation");
        }

        if (missionRepository.findByDonationId(donation.getId()).isPresent()) {
            throw new RuntimeException(
                    "A mission already exists for this donation");
        }

        Mission mission = new Mission();
        mission.setDonation(donation);
        mission.setReceiver(receiver);
        mission.setStatus(MissionStatus.AVAILABLE);

        return new MissionResponse(missionRepository.save(mission));
    }

    @Transactional(readOnly = true)
    public List<MissionResponse> getAvailableMissions(User volunteer) {
        requireVolunteer(volunteer);

        return missionRepository.findByStatus(MissionStatus.AVAILABLE)
                .stream()
                .map(MissionResponse::new)
                .toList();
    }

    @Transactional
    public MissionResponse acceptMission(Long missionId, User volunteer) {
        requireVolunteer(volunteer);

        Mission mission = missionRepository.findByIdForUpdate(missionId)
                .orElseThrow(() -> new RuntimeException("Mission not found"));

        if (mission.getStatus() != MissionStatus.AVAILABLE ||
                mission.getVolunteer() != null) {
            throw new RuntimeException("This mission is no longer available");
        }

        mission.setVolunteer(volunteer);
        mission.setStatus(MissionStatus.ACCEPTED);
        mission.setAcceptedAt(LocalDateTime.now());

        return new MissionResponse(missionRepository.save(mission));
    }

    @Transactional
    public MissionResponse markPickedUp(Long missionId, User volunteer) {
        requireVolunteer(volunteer);

        Mission mission = missionRepository.findByIdForUpdate(missionId)
                .orElseThrow(() -> new RuntimeException("Mission not found"));

        requireAssignedVolunteer(mission, volunteer);

        if (mission.getStatus() != MissionStatus.ACCEPTED) {
            throw new RuntimeException("Mission must be accepted first");
        }

        mission.setStatus(MissionStatus.PICKED_UP);
        mission.setHandoverCode(UUID.randomUUID().toString());

        return new MissionResponse(missionRepository.save(mission));
    }

    @Transactional
    public MissionResponse completeMission(
            Long missionId, String handoverCode, User receiver) {

        requireVerifiedReceiver(receiver);

        Mission mission = missionRepository.findByIdForUpdate(missionId)
                .orElseThrow(() -> new RuntimeException("Mission not found"));

        if (mission.getReceiver() == null ||
                !mission.getReceiver().getId().equals(receiver.getId())) {
            throw new RuntimeException(
                    "This mission belongs to another organization");
        }

        if (mission.getStatus() != MissionStatus.PICKED_UP) {
            throw new RuntimeException(
                    "Mission must be picked up before completion");
        }

        if (handoverCode == null || mission.getHandoverCode() == null ||
                !mission.getHandoverCode().equals(handoverCode.trim())) {
            throw new RuntimeException("Invalid handover code");
        }

        List<Claim> claims = claimRepository.findByDonationId(
                mission.getDonation().getId());

        Claim matchingClaim = claims.stream()
                .filter(claim ->
                        claim.getReceiver() != null &&
                                claim.getReceiver().getId().equals(receiver.getId()) &&
                                claim.getStatus() == ClaimStatus.ACTIVE)
                .findFirst()
                .orElseThrow(() -> new RuntimeException(
                        "No active claim found for this organization"));

        matchingClaim.setStatus(ClaimStatus.COMPLETED);
        claimRepository.save(matchingClaim);

        boolean otherActiveClaimsRemain = claims.stream()
                .filter(claim -> !claim.getId().equals(matchingClaim.getId()))
                .anyMatch(claim -> claim.getStatus() == ClaimStatus.ACTIVE);

        Donation donation = mission.getDonation();
        donation.setStatus(otherActiveClaimsRemain
                ? DonationStatus.PARTIALLY_CLAIMED
                : DonationStatus.COMPLETED);

        donationRepository.save(donation);

        mission.setStatus(MissionStatus.COMPLETED);
        mission.setCompletedAt(LocalDateTime.now());

        return new MissionResponse(missionRepository.save(mission));
    }

    @Transactional(readOnly = true)
    public List<MissionResponse> getMyMissions(User volunteer) {
        requireVolunteer(volunteer);

        return missionRepository.findByVolunteerId(volunteer.getId())
                .stream()
                .map(MissionResponse::new)
                .toList();
    }

    @Transactional(readOnly = true)
    public java.util.Optional<MissionResponse> getMissionByDonationId(Long donationId) {
        return missionRepository.findByDonationId(donationId).map(MissionResponse::new);
    }

    private void requireVolunteer(User user) {
        if (user == null || user.getRole() != Role.VOLUNTEER) {
            throw new RuntimeException(
                    "Only volunteers can perform this action");
        }
    }

    private void requireAssignedVolunteer(Mission mission, User volunteer) {
        if (mission.getVolunteer() == null ||
                !mission.getVolunteer().getId().equals(volunteer.getId())) {
            throw new RuntimeException(
                    "You are not assigned to this mission");
        }
    }

    private void requireVerifiedReceiver(User user) {
        if (user == null ||
                user.getRole() != Role.RECEIVER_ORG ||
                !user.isVerified()) {
            throw new RuntimeException(
                    "Only verified receiver organizations can perform this action");
        }
    }
}