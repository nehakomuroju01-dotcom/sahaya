
package com.sahaya.controllers;

import com.sahaya.dto.CreateNeedRequest;
import com.sahaya.dto.NeedResponse;
import com.sahaya.models.User;
import com.sahaya.services.NeedService;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/needs")
public class NeedController {

    private final NeedService needService;

    public NeedController(NeedService needService) {
        this.needService = needService;
    }

    @PostMapping
    public NeedResponse createNeed(
            @Valid @RequestBody CreateNeedRequest request,
            @AuthenticationPrincipal User user) {
        return needService.createNeed(request, user);
    }

    @GetMapping
    public List<NeedResponse> getOpenNeeds() {
        return needService.getOpenNeeds();
    }

    @GetMapping("/my")
    public List<NeedResponse> getMyNeeds(
            @AuthenticationPrincipal User user) {
        return needService.getMyNeeds(user);
    }
}