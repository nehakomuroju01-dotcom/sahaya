
package com.sahaya.dto;

import com.sahaya.models.DonationType;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

public class CreateDonationRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 150)
    private String title;

    @Size(max = 1000)
    private String description;

    @NotNull(message = "Donation type is required")
    private DonationType type;

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;

    @NotBlank(message = "Quantity unit is required")
    private String quantityUnit;

    @NotBlank(message = "Pickup location is required")
    @Size(max = 200)
    private String pickupLocation;

    private Double latitude;
    private Double longitude;

    @NotNull(message = "Expiry date is required")
    @Future(message = "Expiry date must be in the future")
    private LocalDateTime expiryDate;

    // Food safety fields
    private LocalDateTime foodPreparedAt;

    @Size(max = 500, message = "Allergen information must be under 500 characters")
    private String allergens;

    @Size(max = 500, message = "Storage instructions must be under 500 characters")
    private String storageInstructions;

    public CreateDonationRequest() {}

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public DonationType getType() { return type; }
    public void setType(DonationType type) { this.type = type; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public String getQuantityUnit() {
        return quantityUnit;
    }

    public void setQuantityUnit(String quantityUnit) {
        this.quantityUnit = quantityUnit;
    }

    public String getPickupLocation() { return pickupLocation; }
    public void setPickupLocation(String pickupLocation) { this.pickupLocation = pickupLocation; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public LocalDateTime getExpiryDate() { return expiryDate; }
    public void setExpiryDate(LocalDateTime expiryDate) { this.expiryDate = expiryDate; }

    public LocalDateTime getFoodPreparedAt() { return foodPreparedAt; }
    public void setFoodPreparedAt(LocalDateTime foodPreparedAt) {
        this.foodPreparedAt = foodPreparedAt;
    }

    public String getAllergens() { return allergens; }
    public void setAllergens(String allergens) { this.allergens = allergens; }

    public String getStorageInstructions() { return storageInstructions; }
    public void setStorageInstructions(String storageInstructions) {
        this.storageInstructions = storageInstructions;
    }
}