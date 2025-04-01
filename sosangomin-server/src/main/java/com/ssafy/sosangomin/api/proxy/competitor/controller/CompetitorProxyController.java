package com.ssafy.sosangomin.api.proxy.competitor.controller;

import com.ssafy.sosangomin.api.proxy.competitor.dto.CompetitorAnalysisRequest;
import com.ssafy.sosangomin.api.proxy.competitor.service.CompetitorProxyService;
import com.ssafy.sosangomin.common.annotation.DecryptedId;
import com.ssafy.sosangomin.common.util.IdEncryptionUtil;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import com.ssafy.sosangomin.api.proxy.competitor.docs.CompetitorSwagger;

@Slf4j
@RestController
@RequestMapping("/api/proxy/competitor")
@Tag(name = "경쟁사 분석 프록시 API", description = "FastAPI 경쟁사 분석 서비스를 위한 프록시 API")
@RequiredArgsConstructor
public class CompetitorProxyController implements CompetitorSwagger {

    private final CompetitorProxyService competitorProxyService;
    private final IdEncryptionUtil idEncryptionUtil;

    @GetMapping("/{storeId}")
    public ResponseEntity<Object> getStoreComparisonList(@DecryptedId @PathVariable Long storeId) {
        log.info("Received store comparison list request for store ID: {}", storeId);
        return competitorProxyService.getStoreComparisonList(storeId).block();
    }

    @PostMapping("/analysis")
    public ResponseEntity<Object> oneClickAnalyzeCompetitor(
            @RequestBody CompetitorAnalysisRequest request) {
        log.info("Received one-click competitor analysis request: {}", request);

        // 복호화 수행
        Long decryptedStoreId = idEncryptionUtil.decrypt(request.storeId());

        return competitorProxyService
                .oneClickAnalyzeCompetitor(new CompetitorAnalysisRequest(decryptedStoreId.toString(), request.competitorName()))
                .block();
    }

    @GetMapping("/comparison/{comparisonId}")
    public ResponseEntity<Object> getComparisonResult(@PathVariable String comparisonId) {
        log.info("Received comparison result request for comparison ID: {}", comparisonId);
        return competitorProxyService.getComparisonResult(comparisonId).block();
    }
}