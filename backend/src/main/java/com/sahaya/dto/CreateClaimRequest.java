package com.sahaya.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class CreateClaimRequest {

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Claim quantity must be at least 1")
    private Integer quantity;

    public CreateClaimRequest() {
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}