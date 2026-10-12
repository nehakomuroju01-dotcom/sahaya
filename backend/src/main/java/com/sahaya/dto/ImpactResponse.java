package com.sahaya.dto;

public class ImpactResponse {

    private long totalDonations;
    private long availableDonations;
    private long claimedDonations;
    private long completedDonations;
    private long foodDonations;
    private long goodsDonations;
    private long completedMissions;
    private long totalUnitsDonated;
    private long unitsInCompletedDonations;

    public ImpactResponse(
            long totalDonations,
            long availableDonations,
            long claimedDonations,
            long completedDonations,
            long foodDonations,
            long goodsDonations,
            long completedMissions,
            long totalUnitsDonated,
            long unitsInCompletedDonations
    ) {
        this.totalDonations = totalDonations;
        this.availableDonations = availableDonations;
        this.claimedDonations = claimedDonations;
        this.completedDonations = completedDonations;
        this.foodDonations = foodDonations;
        this.goodsDonations = goodsDonations;
        this.completedMissions = completedMissions;
        this.totalUnitsDonated = totalUnitsDonated;
        this.unitsInCompletedDonations = unitsInCompletedDonations;
    }

    public long getTotalDonations() { return totalDonations; }
    public long getAvailableDonations() { return availableDonations; }
    public long getClaimedDonations() { return claimedDonations; }
    public long getCompletedDonations() { return completedDonations; }
    public long getFoodDonations() { return foodDonations; }
    public long getGoodsDonations() { return goodsDonations; }
    public long getCompletedMissions() { return completedMissions; }
    public long getTotalUnitsDonated() { return totalUnitsDonated; }
    public long getUnitsInCompletedDonations() { return unitsInCompletedDonations; }
}