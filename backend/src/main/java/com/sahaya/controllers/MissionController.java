
package com.sahaya.controllers;

import com.sahaya.dto.CompleteMissionRequest;
import com.sahaya.dto.CreateMissionRequest;
import com.sahaya.dto.MissionResponse;
import com.sahaya.models.User;
import com.sahaya.services.MissionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/missions")
public class MissionController {

    private final MissionService missionService;

    public MissionController(MissionService missionService) {
        this.missionService = missionService;
    }

    @PostMapping
    public ResponseEntity<MissionResponse> createMission(
            @Valid @RequestBody CreateMissionRequest request,
            Authentication authentication) {

        User receiver = (User) authentication.getPrincipal();

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(missionService.createMission(request, receiver));
    }

    @GetMapping("/available")
    public ResponseEntity<List<MissionResponse>> getAvailableMissions(
            Authentication authentication) {

        User volunteer = (User) authentication.getPrincipal();

        return ResponseEntity.ok(
                missionService.getAvailableMissions(volunteer));
    }

    @PutMapping("/{missionId}/accept")
    public ResponseEntity<MissionResponse> acceptMission(
            @PathVariable Long missionId,
            Authentication authentication) {

        User volunteer = (User) authentication.getPrincipal();

        return ResponseEntity.ok(
                missionService.acceptMission(missionId, volunteer));
    }

    @PutMapping("/{missionId}/picked-up")
    public ResponseEntity<MissionResponse> markPickedUp(
            @PathVariable Long missionId,
            Authentication authentication) {

        User volunteer = (User) authentication.getPrincipal();

        return ResponseEntity.ok(
                missionService.markPickedUp(missionId, volunteer));
    }

    @GetMapping("/{missionId}/handover-code")
    public ResponseEntity<Map<String, String>> getHandoverCode(
            @PathVariable Long missionId,
            Authentication authentication) {

        User volunteer = (User) authentication.getPrincipal();

        String code = missionService.getHandoverCode(missionId, volunteer);

        return ResponseEntity.ok(Map.of("handoverCode", code));
    }

    @PostMapping("/{missionId}/complete")
    public ResponseEntity<MissionResponse> completeMission(
            @PathVariable Long missionId,
            @Valid @RequestBody CompleteMissionRequest request,
            Authentication authentication) {

        User receiver = (User) authentication.getPrincipal();

        return ResponseEntity.ok(
                missionService.completeMission(
                        missionId, request.getHandoverCode(), receiver));
    }

    @GetMapping("/my")
    public ResponseEntity<List<MissionResponse>> getMyMissions(
            Authentication authentication) {

        User volunteer = (User) authentication.getPrincipal();

        return ResponseEntity.ok(missionService.getMyMissions(volunteer));
    }

    @GetMapping("/donation/{donationId}")
    public ResponseEntity<MissionResponse> getMissionByDonationId(
            @PathVariable Long donationId) {

        return missionService.getMissionByDonationId(donationId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.noContent().build());
    }
}