package com.sahaya.dto;

import jakarta.validation.constraints.NotBlank;

public class CompleteMissionRequest {

    @NotBlank(message = "Handover code is required")
    private String handoverCode;

    public CompleteMissionRequest() {}

    public String getHandoverCode() {
        return handoverCode;
    }

    public void setHandoverCode(String handoverCode) {
        this.handoverCode = handoverCode;
    }
}