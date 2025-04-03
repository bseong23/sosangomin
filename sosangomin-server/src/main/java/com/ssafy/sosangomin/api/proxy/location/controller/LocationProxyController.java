package com.ssafy.sosangomin.api.proxy.location.controller;

import com.ssafy.sosangomin.api.proxy.location.docs.LocationSwagger;
import com.ssafy.sosangomin.api.proxy.location.dto.LocationRecommendRequest;
import com.ssafy.sosangomin.api.proxy.location.service.LocationProxyService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/proxy/location")
@Tag(name = "입지 추천 프록시 API", description = "FastAPI 입지 추천 서비스를 위한 프록시 API")
@RequiredArgsConstructor
public class LocationProxyController implements LocationSwagger {

    private final LocationProxyService locationProxyService;

    @PostMapping("/recommend")
    public ResponseEntity<Object> recommendLocation(@RequestBody LocationRecommendRequest request) {
        log.info("Received location recommendation request: {}", request);
        return locationProxyService.recommendLocation(request).block();
    }

    @PostMapping("/map")
    public ResponseEntity<Object> recommendMapLocations(@RequestBody LocationRecommendRequest request) {
        log.info("Received map location recommendation request: {}", request);
        return locationProxyService.recommendMapLocations(request).block();
    }
}

