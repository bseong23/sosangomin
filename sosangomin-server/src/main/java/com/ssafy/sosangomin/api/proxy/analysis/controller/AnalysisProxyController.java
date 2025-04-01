package com.ssafy.sosangomin.api.proxy.analysis.controller;

import com.ssafy.sosangomin.api.proxy.analysis.docs.AnalysisSwagger;
import com.ssafy.sosangomin.api.proxy.analysis.dto.CombinedAnalysisRequest;
import com.ssafy.sosangomin.api.proxy.analysis.service.AnalysisProxyService;
import com.ssafy.sosangomin.common.util.IdEncryptionUtil;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@Slf4j
@RestController
@RequestMapping("/api/proxy/analysis")
@Tag(name = "데이터 분석 프록시 API", description = "FastAPI 데이터 분석 서비스를 위한 프록시 API")
@RequiredArgsConstructor
public class AnalysisProxyController implements AnalysisSwagger {

    private final AnalysisProxyService analysisProxyService;
    private final IdEncryptionUtil idEncryptionUtil;
    @PostMapping
    public ResponseEntity<Object> analyzeCombinedData(@RequestBody CombinedAnalysisRequest request) {
        log.info("Received combined analysis request: {}", request);
        return analysisProxyService.analyzeCombinedData(request)
                .map(ResponseEntity::ok).block();
    }

    @GetMapping("/{analysisId}")
    public ResponseEntity<Object> getAnalysisResult(@PathVariable String analysisId) {
        log.info("Received analysis result request for ID: {}", analysisId);
        return analysisProxyService.getAnalysisResult(analysisId)
                .map(ResponseEntity::ok).block();
    }

    @GetMapping("/source")
    public ResponseEntity<Object> getAnalysisResultsBySource(@RequestParam String sourceId) {
        log.info("Received analysis results list request for source ID: {}", sourceId);
        return analysisProxyService.getAnalysisResultsBySource(sourceId)
                .map(ResponseEntity::ok).block();
    }

    @GetMapping("/latest")
    public ResponseEntity<Object> getLatestAnalysisResult(@RequestParam String sourceId) {
        log.info("Received latest analysis result request for source ID: {}", sourceId);
        return analysisProxyService.getLatestAnalysisResult(sourceId)
                .map(ResponseEntity::ok).block();
    }
}