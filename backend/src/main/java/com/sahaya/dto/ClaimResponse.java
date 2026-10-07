package com.sahaya.dto;

import com.sahaya.models.Claim;
import com.sahaya.models.ClaimStatus;

import java.time.LocalDateTime;

public class ClaimResponse {

    private Long id;
    private Long donationId;
    private String donationTitle;
    private Long receiverId;
    private String receiverName;
    private Integer quantity;
    private ClaimStatus status;
    private LocalDateTime claimedAt;

    public ClaimResponse(Claim claim) {
        this.id = claim.getId();
        this.donationId = claim.getDonation().getId();
        this.donationTitle = claim.getDonation().getTitle();
        this.receiverId = claim.getReceiver().getId();
        this.receiverName = claim.getReceiver().getName();
        this.quantity = claim.getQuantity();
        this.status = claim.getStatus();
        this.claimedAt = claim.getClaimedAt();
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

    public Long getReceiverId() {
        return receiverId;
    }

    public String getReceiverName() {
        return receiverName;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public ClaimStatus getStatus() {
        return status;
    }

    public LocalDateTime getClaimedAt() {
        return claimedAt;
    }
}