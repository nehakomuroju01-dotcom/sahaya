package com.sahaya.services;

import com.sahaya.dto.CreateMissionRequest;
import com.sahaya.dto.MissionResponse;
import com.sahaya.models.Donation;
import com.sahaya.models.DonationStatus;
import com.sahaya.models.Mission;
import com.sahaya.models.MissionStatus;
import com.sahaya.models.Role;
import com.sahaya.models.User;
import com.sahaya.repositories.DonationRepository;
import com.sahaya.repositories.MissionRepository;
import com.sahaya.repositories.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MissionService {

    private final MissionRepository missionRepository;
    private final DonationRepository donationRepository;
    private final UserRepository userRepository;

    public MissionService(
            MissionRepository missionRepository,
            DonationRepository donationRepository,
            UserRepository userRepository
    ) {
        this.missionRepository = missionRepository;
        this.donationRepository = donationRepository;
        this.userRepository = userRepository;
    }

    // Receiver creates a pickup mission
    public MissionResponse createMission(
            CreateMissionRequest request,
            User receiver
    ) {

        if (receiver.getRole() != Role.RECEIVER_ORG) {
            throw new RuntimeException(
                    "Only receiver organizations can create missions"
            );
        }

        if (!receiver.isVerified()) {
            throw new RuntimeException(
                    "Receiver organization is not verified"
            );
        }

        Donation donation = donationRepository.findById(
                request.getDonationId()
        ).orElseThrow(() ->
                new RuntimeException("Donation not found")
        );

        if (donation.getStatus() != DonationStatus.CLAIMED &&
                donation.getStatus() != DonationStatus.PARTIALLY_CLAIMED) {

            throw new RuntimeException(
                    "Donation is not ready for pickup"
            );
        }

        Mission existingMission =
                missionRepository.findByDonationId(donation.getId())
                        .orElse(null);

        if (existingMission != null) {
            throw new RuntimeException(
                    "A mission already exists for this donation"
            );
        }

        if (!donation.getDonor().getId().equals(
                donation.getDonor().getId()
        )) {
            throw new RuntimeException(
                    "Invalid donation"
            );
        }

        User requestedReceiver = userRepository.findById(
                request.getReceiverId()
        ).orElseThrow(() ->
                new RuntimeException("Receiver not found")
        );

        if (requestedReceiver.getRole() != Role.RECEIVER_ORG) {
            throw new RuntimeException(
                    "Selected user is not a receiver organization"
            );
        }

        if (!requestedReceiver.getId().equals(receiver.getId())) {
            throw new RuntimeException(
                    "You can only create missions for your own organization"
            );
        }

        Mission mission = new Mission();

        mission.setDonation(donation);
        mission.setReceiver(receiver);
        mission.setStatus(MissionStatus.AVAILABLE);

        return new MissionResponse(
                missionRepository.save(mission)
        );
    }

    // Volunteers can see available missions
    public List<MissionResponse> getAvailableMissions(User volunteer) {

        if (volunteer.getRole() != Role.VOLUNTEER) {
            throw new RuntimeException(
                    "Only volunteers can view available missions"
            );
        }

        return missionRepository
                .findByStatus(MissionStatus.AVAILABLE)
                .stream()
                .map(MissionResponse::new)
                .toList();
    }

    // Volunteer accepts a mission
    public MissionResponse acceptMission(
            Long missionId,
            User volunteer
    ) {

        if (volunteer.getRole() != Role.VOLUNTEER) {
            throw new RuntimeException(
                    "Only volunteers can accept missions"
            );
        }

        Mission mission = missionRepository.findById(missionId)
                .orElseThrow(() ->
                        new RuntimeException("Mission not found")
                );

        if (mission.getStatus() != MissionStatus.AVAILABLE) {
            throw new RuntimeException(
                    "This mission is no longer available"
            );
        }

        mission.setVolunteer(volunteer);
        mission.setStatus(MissionStatus.ACCEPTED);
        mission.setAcceptedAt(LocalDateTime.now());

        return new MissionResponse(
                missionRepository.save(mission)
        );
    }

    // Volunteer marks the donation as picked up
    public MissionResponse markPickedUp(
            Long missionId,
            User volunteer
    ) {

        Mission mission = missionRepository.findById(missionId)
                .orElseThrow(() ->
                        new RuntimeException("Mission not found")
                );

        if (mission.getVolunteer() == null ||
                !mission.getVolunteer().getId().equals(
                        volunteer.getId()
                )) {

            throw new RuntimeException(
                    "You are not assigned to this mission"
            );
        }

        if (mission.getStatus() != MissionStatus.ACCEPTED) {
            throw new RuntimeException(
                    "Mission must be accepted first"
            );
        }

        mission.setStatus(MissionStatus.PICKED_UP);

        return new MissionResponse(
                missionRepository.save(mission)
        );
    }

    public List<MissionResponse> getMyMissions(User volunteer) {

        if (volunteer.getRole() != Role.VOLUNTEER) {
            throw new RuntimeException(
                    "Only volunteers can view their missions"
            );
        }

        return missionRepository
                .findByVolunteerId(volunteer.getId())
                .stream()
                .map(MissionResponse::new)
                .toList();
    }
}