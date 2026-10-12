package com.sahaya.services;

import com.sahaya.dto.ImpactResponse;
import com.sahaya.models.Donation;
import com.sahaya.models.DonationStatus;
import com.sahaya.models.DonationType;
import com.sahaya.models.MissionStatus;
import com.sahaya.repositories.DonationRepository;
import com.sahaya.repositories.MissionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ImpactService {

    private final DonationRepository donationRepository;
    private final MissionRepository missionRepository;

    public ImpactService(
            DonationRepository donationRepository,
            MissionRepository missionRepository
    ) {
        this.donationRepository = donationRepository;
        this.missionRepository = missionRepository;
    }

    public ImpactResponse getSummary() {

        List<Donation> donations = donationRepository.findAll();

        long total = donations.size();

        long available = donations.stream()
                .filter(d -> d.getStatus() == DonationStatus.AVAILABLE)
                .count();

        long claimed = donations.stream()
                .filter(d ->
                        d.getStatus() == DonationStatus.CLAIMED
                                || d.getStatus() == DonationStatus.PARTIALLY_CLAIMED)
                .count();

        long completed = donations.stream()
                .filter(d -> d.getStatus() == DonationStatus.COMPLETED)
                .count();

        long food = donations.stream()
                .filter(d -> d.getType() == DonationType.FOOD)
                .count();

        long goods = donations.stream()
                .filter(d -> d.getType() == DonationType.GOODS)
                .count();

        long totalUnits = donations.stream()
                .mapToLong(d -> d.getQuantity() == null ? 0 : d.getQuantity())
                .sum();

        long completedUnits = donations.stream()
                .filter(d -> d.getStatus() == DonationStatus.COMPLETED)
                .mapToLong(d -> d.getQuantity() == null ? 0 : d.getQuantity())
                .sum();

        long completedMissions = missionRepository.findAll().stream()
                .filter(m -> m.getStatus() == MissionStatus.COMPLETED)
                .count();

        return new ImpactResponse(
                total,
                available,
                claimed,
                completed,
                food,
                goods,
                completedMissions,
                totalUnits,
                completedUnits
        );
    }
}