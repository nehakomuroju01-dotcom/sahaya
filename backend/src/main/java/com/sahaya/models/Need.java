
package com.sahaya.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "needs")
public class Need {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(length = 1000)
    private String description;

    @Enumerated(EnumType.STRING)
    private DonationType type;

    private Integer quantity;

    private String location;

    @Enumerated(EnumType.STRING)
    private NeedStatus status = NeedStatus.OPEN;

    private LocalDateTime createdAt = LocalDateTime.now();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organization_id", nullable = false)
    private User organization;

    public Need() {}

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public DonationType getType() { return type; }
    public Integer getQuantity() { return quantity; }
    public String getLocation() { return location; }
    public NeedStatus getStatus() { return status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public User getOrganization() { return organization; }

    public void setTitle(String title) { this.title = title; }
    public void setDescription(String description) { this.description = description; }
    public void setType(DonationType type) { this.type = type; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public void setLocation(String location) { this.location = location; }
    public void setStatus(NeedStatus status) { this.status = status; }
    public void setOrganization(User organization) { this.organization = organization; }
}