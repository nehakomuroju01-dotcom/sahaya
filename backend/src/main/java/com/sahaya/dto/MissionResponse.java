package com.sahaya.dto;

import com.sahaya.models.Mission;
import com.sahaya.models.MissionStatus;

import java.time.LocalDateTime;

public class MissionResponse {

    private Long id;

    private Long donationId;
    private String donationTitle;
    private Integer donationQuantity;

    private Long receiverId;
    private String receiverName;

    private Long volunteerId;
    private String volunteerName;

    private MissionStatus status;

    private LocalDateTime createdAt;
    private LocalDateTime acceptedAt;
    private LocalDateTime completedAt;

    public MissionResponse(Mission mission) {

        this.id = mission.getId();

        this.donationId = mission.getDonation().getId();
        this.donationTitle = mission.getDonation().getTitle();
        this.donationQuantity = mission.getDonation().getQuantity();

        this.receiverId = mission.getReceiver().getId();
        this.receiverName = mission.getReceiver().getName();

        if (mission.getVolunteer() != null) {
            this.volunteerId = mission.getVolunteer().getId();
            this.volunteerName = mission.getVolunteer().getName();
        }

        this.status = mission.getStatus();

        this.createdAt = mission.getCreatedAt();
        this.acceptedAt = mission.getAcceptedAt();
        this.completedAt = mission.getCompletedAt();
    }

    public Long getId() {
        return id;
    }

    public Long getDonationId() {
        return donationId;
    }

    public String getDonationTitle() {
        return donationTitle;
    }

    public Integer getDonationQuantity() {
        return donationQuantity;
    }

    public Long getReceiverId() {
        return receiverId;
    }

    public String getReceiverName() {
        return receiverName;
    }

    public Long getVolunteerId() {
        return volunteerId;
    }

    public String getVolunteerName() {
        return volunteerName;
    }

    public MissionStatus getStatus() {
        return status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getAcceptedAt() {
        return acceptedAt;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }
}