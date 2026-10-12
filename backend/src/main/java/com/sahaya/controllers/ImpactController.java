package com.sahaya.controllers;

import com.sahaya.dto.ImpactResponse;
import com.sahaya.services.ImpactService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/impact")
public class ImpactController {

    private final ImpactService impactService;

    public ImpactController(ImpactService impactService) {
        this.impactService = impactService;
    }

    @GetMapping("/summary")
    public ResponseEntity<ImpactResponse> getSummary() {
        return ResponseEntity.ok(impactService.getSummary());
    }
}