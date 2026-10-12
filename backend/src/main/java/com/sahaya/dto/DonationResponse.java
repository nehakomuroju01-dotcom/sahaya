package com.sahaya.dto;

import com.sahaya.models.Donation;
import com.sahaya.models.DonationStatus;
import com.sahaya.models.DonationType;

import java.time.LocalDateTime;

public class DonationResponse {

    private Long id;
    private String title;
    private String description;
    private DonationType type;
    private Integer quantity;
    private Integer remainingQuantity;
    private String quantityUnit;
    private String pickupLocation;
    private Double latitude;
    private Double longitude;
    private LocalDateTime expiryDate;
    private DonationStatus status;
    private Long donorId;
    private String donorName;

    private LocalDateTime foodPreparedAt;
    private String allergens;
    private String storageInstructions;

    public DonationResponse(Donation donation) {
        this(donation, false);
    }

    public DonationResponse(Donation donation, boolean includeExactLocation) {
        this(donation, includeExactLocation, donation.getQuantity());
    }

    public DonationResponse(
            Donation donation,
            boolean includeExactLocation,
            Integer remainingQuantity
    ) {
        this.id = donation.getId();
        this.title = donation.getTitle();
        this.description = donation.getDescription();
        this.type = donation.getType();
        this.quantity = donation.getQuantity();
        this.remainingQuantity = remainingQuantity;
        this.quantityUnit = donation.getQuantityUnit();

        if (includeExactLocation) {
            this.pickupLocation = donation.getPickupLocation();
            this.latitude = donation.getLatitude();
            this.longitude = donation.getLongitude();
        }

        this.expiryDate = donation.getExpiryDate();
        this.status = donation.getStatus();
        this.donorId = donation.getDonor().getId();
        this.donorName = donation.getDonor().getName();

        this.foodPreparedAt = donation.getFoodPreparedAt();
        this.allergens = donation.getAllergens();
        this.storageInstructions = donation.getStorageInstructions();
    }

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public DonationType getType() { return type; }
    public Integer getQuantity() { return quantity; }
    public Integer getRemainingQuantity() { return remainingQuantity; }
    public String getQuantityUnit() { return quantityUnit; }
    public String getPickupLocation() { return pickupLocation; }
    public Double getLatitude() { return latitude; }
    public Double getLongitude() { return longitude; }
    public LocalDateTime getExpiryDate() { return expiryDate; }
    public DonationStatus getStatus() { return status; }
    public Long getDonorId() { return donorId; }
    public String getDonorName() { return donorName; }
    public LocalDateTime getFoodPreparedAt() { return foodPreparedAt; }
    public String getAllergens() { return allergens; }
    public String getStorageInstructions() { return storageInstructions; }
}