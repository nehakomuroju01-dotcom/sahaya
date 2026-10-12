
package com.sahaya.dto;

import com.sahaya.models.Need;
import com.sahaya.models.DonationType;
import com.sahaya.models.NeedStatus;
import java.time.LocalDateTime;

public class NeedResponse {

    private Long id;
    private String title;
    private String description;
    private DonationType type;
    private Integer quantity;
    private String location;
    private NeedStatus status;
    private LocalDateTime createdAt;
    private String organizationName;

    public NeedResponse(Need need) {
        this.id = need.getId();
        this.title = need.getTitle();
        this.description = need.getDescription();
        this.type = need.getType();
        this.quantity = need.getQuantity();
        this.location = need.getLocation();
        this.status = need.getStatus();
        this.createdAt = need.getCreatedAt();
        this.organizationName = need.getOrganization().getName();
    }

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public DonationType getType() { return type; }
    public Integer getQuantity() { return quantity; }
    public String getLocation() { return location; }
    public NeedStatus getStatus() { return status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public String getOrganizationName() { return organizationName; }
}