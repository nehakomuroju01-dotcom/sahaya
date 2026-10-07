package com.sahaya.dto;

import jakarta.validation.constraints.NotNull;

public class CreateMissionRequest {

    @NotNull(message = "Donation ID is required")
    private Long donationId;

    @NotNull(message = "Receiver ID is required")
    private Long receiverId;

    public CreateMissionRequest() {
    }

    public Long getDonationId() {
        return donationId;
    }

    public void setDonationId(Long donationId) {
        this.donationId = donationId;
    }

    public Long getReceiverId() {
        return receiverId;
    }

    public void setReceiverId(Long receiverId) {
        this.receiverId = receiverId;
    }
}