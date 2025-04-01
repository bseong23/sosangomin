package com.ssafy.sosangomin.api.proxy.review.controller;

import com.ssafy.sosangomin.api.proxy.review.docs.ReviewSwagger;
import com.ssafy.sosangomin.api.proxy.review.dto.ReviewAnalysisRequest;
import com.ssafy.sosangomin.api.proxy.review.service.ReviewProxyService;
import com.ssafy.sosangomin.common.annotation.DecryptedId;
import com.ssafy.sosangomin.common.util.IdEncryptionUtil;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@Slf4j
@RestController
@RequestMapping("/api/proxy/reviews")
@Tag(name = "리뷰 분석 프록시 API", description = "FastAPI 리뷰 분석 서비스를 위한 프록시 API")
@RequiredArgsConstructor
public class ReviewProxyController implements ReviewSwagger {

    private final ReviewProxyService reviewProxyService;
    private final IdEncryptionUtil idEncryptionUtil;
    @PostMapping
    public ResponseEntity<Object> analyzeStoreReviews(@RequestBody ReviewAnalysisRequest encryptedRequest) {
        log.info("Received review analysis request: {}", encryptedRequest);

        Long decryptedStoreId = idEncryptionUtil.decrypt(encryptedRequest.storeId());

        ReviewAnalysisRequest decryptedRequest = new ReviewAnalysisRequest(
                String.valueOf(decryptedStoreId),
                encryptedRequest.placeId()
        );

        log.info("Decrypted store_id for review analysis: {}", decryptedStoreId);

        return reviewProxyService.analyzeStoreReviews(decryptedRequest).block();
    }

    @GetMapping("/store/{storeId}")
    public ResponseEntity<Object> getStoreReviewsList(@DecryptedId @PathVariable Long storeId) {
        log.info("Received store reviews list request for store ID: {}", storeId);
        return reviewProxyService.getStoreReviewsList(storeId).block();
    }

    @GetMapping("/analysis/{analysisId}")
    public ResponseEntity<Object> getReviewAnalysis(@PathVariable String analysisId) {
        log.info("Received review analysis request for analysis ID: {}", analysisId);
        return reviewProxyService.getReviewAnalysis(analysisId).block();
    }
}