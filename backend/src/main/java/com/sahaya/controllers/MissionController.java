package com.sahaya.controllers;

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
            Authentication authentication
    ) {

        User receiver = (User) authentication.getPrincipal();

        MissionResponse response =
                missionService.createMission(
                        request,
                        receiver
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping("/available")
    public ResponseEntity<List<MissionResponse>> getAvailableMissions(
            Authentication authentication
    ) {

        User volunteer =
                (User) authentication.getPrincipal();

        return ResponseEntity.ok(
                missionService.getAvailableMissions(volunteer)
        );
    }

    @PutMapping("/{missionId}/accept")
    public ResponseEntity<MissionResponse> acceptMission(
            @PathVariable Long missionId,
            Authentication authentication
    ) {

        User volunteer =
                (User) authentication.getPrincipal();

        return ResponseEntity.ok(
                missionService.acceptMission(
                        missionId,
                        volunteer
                )
        );
    }

    @PutMapping("/{missionId}/picked-up")
    public ResponseEntity<MissionResponse> markPickedUp(
            @PathVariable Long missionId,
            Authentication authentication
    ) {

        User volunteer =
                (User) authentication.getPrincipal();

        return ResponseEntity.ok(
                missionService.markPickedUp(
                        missionId,
                        volunteer
                )
        );
    }

    @GetMapping("/my")
    public ResponseEntity<List<MissionResponse>> getMyMissions(
            Authentication authentication
    ) {

        User volunteer =
                (User) authentication.getPrincipal();

        return ResponseEntity.ok(
                missionService.getMyMissions(volunteer)
        );
    }
}