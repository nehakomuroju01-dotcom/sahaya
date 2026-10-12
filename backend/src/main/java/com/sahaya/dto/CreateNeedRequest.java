
package com.sahaya.dto;

import com.sahaya.models.DonationType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class CreateNeedRequest {

    @NotBlank
    @Size(max = 150)
    private String title;

    @Size(max = 1000)
    private String description;

    @NotNull
    private DonationType type;

    @NotNull
    @Min(1)
    private Integer quantity;

    @NotBlank
    @Size(max = 200)
    private String location;

    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public DonationType getType() { return type; }
    public Integer getQuantity() { return quantity; }
    public String getLocation() { return location; }

    public void setTitle(String title) { this.title = title; }
    public void setDescription(String description) { this.description = description; }
    public void setType(DonationType type) { this.type = type; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public void setLocation(String location) { this.location = location; }
}