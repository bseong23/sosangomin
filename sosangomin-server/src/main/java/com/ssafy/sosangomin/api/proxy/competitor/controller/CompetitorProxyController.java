package com.ssafy.sosangomin.api.proxy.competitor.controller;

import com.ssafy.sosangomin.api.proxy.competitor.dto.CompetitorAnalysisRequest;
import com.ssafy.sosangomin.api.proxy.competitor.service.CompetitorProxyService;
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
        Long decryptedStoreId = idEncryptionUtil.decrypt(request.storeId());

        CompetitorAnalysisRequest decryptedRequest = new CompetitorAnalysisRequest(
                String.valueOf(decryptedStoreId),
                request.competitorName()
        );
        log.info("Decrypted store_id for competitor analysis: {}", decryptedStoreId);

        return competitorProxyService
                .oneClickAnalyzeCompetitor(decryptedRequest)
                .block();
    }

    @GetMapping("/comparison/{comparisonId}")
    public ResponseEntity<Object> getComparisonResult(@PathVariable String comparisonId) {
        log.info("Received comparison result request for comparison ID: {}", comparisonId);
        return competitorProxyService.getComparisonResult(comparisonId).block();
    }
}