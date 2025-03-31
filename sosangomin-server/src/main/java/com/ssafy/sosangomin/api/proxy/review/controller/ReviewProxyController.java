package com.ssafy.sosangomin.api.proxy.review.controller;

import com.ssafy.sosangomin.api.proxy.review.docs.ReviewSwagger;
import com.ssafy.sosangomin.api.proxy.review.dto.ReviewAnalysisRequest;
import com.ssafy.sosangomin.api.proxy.review.service.ReviewProxyService;
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

    @PostMapping
    public ResponseEntity<Object> analyzeStoreReviews(@RequestBody ReviewAnalysisRequest request) {
        log.info("Received review analysis request: {}", request);
        return reviewProxyService.analyzeStoreReviews(request).block();
    }

    @GetMapping("/store/{storeId}")
    public ResponseEntity<Object> getStoreReviewsList(@PathVariable int storeId) {
        log.info("Received store reviews list request for store ID: {}", storeId);
        return reviewProxyService.getStoreReviewsList(storeId).block();
    }

    @GetMapping("/analysis/{analysisId}")
    public ResponseEntity<Object> getReviewAnalysis(@PathVariable String analysisId) {
        log.info("Received review analysis request for analysis ID: {}", analysisId);
        return reviewProxyService.getReviewAnalysis(analysisId).block();
    }
}