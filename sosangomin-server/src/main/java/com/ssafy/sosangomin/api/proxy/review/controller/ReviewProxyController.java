package com.ssafy.sosangomin.api.proxy.review.controller;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.ssafy.sosangomin.api.proxy.review.docs.ReviewSwagger;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import jakarta.validation.constraints.NotNull;
import java.util.HashMap;

@Slf4j
@RestController
@RequestMapping("/api/proxy/reviews")
@Tag(name = "리뷰 분석 프록시 API", description = "FastAPI 리뷰 분석 서비스를 위한 프록시 API")
public class ReviewProxyController implements ReviewSwagger {

    private final WebClient webClient;

    @Autowired
    public ReviewProxyController(WebClient webClient) {
        this.webClient = webClient;
    }

    @Override
    @PostMapping("")
    public Mono<ResponseEntity<Object>> analyzeStoreReviews(@RequestBody ReviewAnalysisRequest request) {
        log.info("Received review analysis request: {}", request);

        return webClient.post()
                .uri("/api/reviews/analyze")
                .bodyValue(request)
                .retrieve()
                .onStatus(
                        status -> status.is4xxClientError() || status.is5xxServerError(),
                        response -> response.bodyToMono(String.class)
                                .flatMap(errorBody -> {
                                    log.error("Error from FastAPI review analysis: {}", errorBody);
                                    return Mono.error(new RuntimeException("FastAPI 서버 오류: " + errorBody));
                                })
                )
                .bodyToMono(Object.class)
                .map(response -> ResponseEntity.ok().body(response))
                .onErrorResume(e -> {
                    log.error("Error in review analysis proxy: {}", e.getMessage());

                    HashMap<String, String> errorResponse = new HashMap<>();
                    errorResponse.put("error", "리뷰 분석 중 오류가 발생했습니다");
                    errorResponse.put("message", e.getMessage());

                    return Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .body((Object)errorResponse));
                });
    }

    @Override
    @GetMapping("/store/{storeId}")
    public Mono<ResponseEntity<Object>> getStoreReviewsList(@PathVariable int storeId) {
        log.info("Received store reviews list request for store ID: {}", storeId);

        return webClient.get()
                .uri("/api/reviews/store/{storeId}", storeId)
                .retrieve()
                .onStatus(
                        status -> status.is4xxClientError() || status.is5xxServerError(),
                        response -> response.bodyToMono(String.class)
                                .flatMap(errorBody -> {
                                    log.error("Error from FastAPI store reviews list: {}", errorBody);
                                    return Mono.error(new RuntimeException("FastAPI 서버 오류: " + errorBody));
                                })
                )
                .bodyToMono(Object.class)
                .map(response -> ResponseEntity.ok().body(response))
                .onErrorResume(e -> {
                    log.error("Error in store reviews list proxy: {}", e.getMessage());

                    HashMap<String, String> errorResponse = new HashMap<>();
                    errorResponse.put("error", "매장 리뷰 목록 조회 중 오류가 발생했습니다");
                    errorResponse.put("message", e.getMessage());

                    return Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .body((Object)errorResponse));
                });
    }

    @Override
    @GetMapping("/analysis/{analysisId}")
    public Mono<ResponseEntity<Object>> getReviewAnalysis(@PathVariable String analysisId) {
        log.info("Received review analysis request for analysis ID: {}", analysisId);

        return webClient.get()
                .uri("/api/reviews/analysis/{analysisId}", analysisId)
                .retrieve()
                .onStatus(
                        status -> status.is4xxClientError() || status.is5xxServerError(),
                        response -> response.bodyToMono(String.class)
                                .flatMap(errorBody -> {
                                    log.error("Error from FastAPI review analysis: {}", errorBody);
                                    return Mono.error(new RuntimeException("FastAPI 서버 오류: " + errorBody));
                                })
                )
                .bodyToMono(Object.class)
                .map(response -> ResponseEntity.ok().body(response))
                .onErrorResume(e -> {
                    log.error("Error in review analysis proxy: {}", e.getMessage());

                    HashMap<String, String> errorResponse = new HashMap<>();
                    errorResponse.put("error", "리뷰 분석 결과 조회 중 오류가 발생했습니다");
                    errorResponse.put("message", e.getMessage());

                    return Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .body((Object)errorResponse));
                });
    }

    @Data
    public static class ReviewAnalysisRequest {
        @NotNull
        @JsonProperty("store_id")
        private int storeId;

        @NotNull
        @JsonProperty("place_id")
        private String placeId;
    }
}