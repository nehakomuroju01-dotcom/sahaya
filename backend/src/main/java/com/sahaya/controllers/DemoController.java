package com.sahaya.controllers;

import com.sahaya.services.DemoDataSeederService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/demo")
public class DemoController {

    private final DemoDataSeederService demoDataSeederService;

    public DemoController(DemoDataSeederService demoDataSeederService) {
        this.demoDataSeederService = demoDataSeederService;
    }

    @PostMapping("/reset")
    public ResponseEntity<Map<String, String>> resetDemoData() {
        demoDataSeederService.resetAndSeed();
        return ResponseEntity.ok(Map.of(
                "status", "SUCCESS",
                "message", "Database successfully reset and re-seeded with realistic presentation data!"
        ));
    }
}
