package com.ssafy.sosangomin.api.proxy.area.controller;

import com.ssafy.sosangomin.api.proxy.area.docs.AreaAnalysisSwagger;
import com.ssafy.sosangomin.api.proxy.area.service.AreaAnalysisProxyService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/proxy/area-analysis")
@Tag(name = "상권 분석 프록시 API", description = "FastAPI 상권 분석 서비스를 위한 프록시 API")
@RequiredArgsConstructor
public class AreaAnalysisProxyController implements AreaAnalysisSwagger {

    private final AreaAnalysisProxyService areaAnalysisProxyService;

    @GetMapping("/summary")
    public ResponseEntity<Object> getSummaryAnalysis(
            @RequestParam String regionName,
            @RequestParam String industryName) {
        log.info("Received summary analysis request for region: {} and industry: {}", regionName, industryName);
        return areaAnalysisProxyService.getSummaryAnalysis(regionName, industryName).block();
    }

    @GetMapping("/population")
    public ResponseEntity<Object> getPopulationAnalysis(@RequestParam String regionName) {
        log.info("Received population analysis request for region: {}", regionName);
        return areaAnalysisProxyService.getPopulationAnalysis(regionName).block();
    }

    @GetMapping("/category")
    public ResponseEntity<Object> getCategoryAnalysis(
            @RequestParam String regionName,
            @RequestParam String industryName) {
        log.info("Received category analysis request for region: {} and industry: {}", regionName, industryName);
        return areaAnalysisProxyService.getCategoryAnalysis(regionName, industryName).block();
    }

    @GetMapping("/sales")
    public ResponseEntity<Object> getSalesAnalysis(
            @RequestParam String regionName,
            @RequestParam String industryName) {
        log.info("Received sales analysis request for region: {} and industry: {}", regionName, industryName);
        return areaAnalysisProxyService.getSalesAnalysis(regionName, industryName).block();
    }
}