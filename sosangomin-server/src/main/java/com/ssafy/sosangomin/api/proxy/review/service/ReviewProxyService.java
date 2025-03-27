package com.ssafy.sosangomin.api.proxy.review.service;

import com.ssafy.sosangomin.api.proxy.review.dto.ReviewAnalysisRequest;
import com.ssafy.sosangomin.common.exception.ErrorMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.HashMap;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReviewProxyService {

    private final WebClient webClient;

    public Mono<ResponseEntity<Object>> analyzeStoreReviews(ReviewAnalysisRequest request) {
        return webClient.post()
                .uri("/api/reviews/analyze")
                .bodyValue(request)
                .retrieve()
                .onStatus(
                        status -> status.is4xxClientError() || status.is5xxServerError(),
                        response -> response.bodyToMono(String.class)
                                .flatMap(errorBody -> {
                                    log.error("Error from FastAPI review analysis: {}", errorBody);
                                    return Mono.error(new RuntimeException(ErrorMessage.ERR_INTERNAL_SERVER_ENCRYPTION_ERROR.name()));
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

    public Mono<ResponseEntity<Object>> getStoreReviewsList(int storeId) {
        return webClient.get()
                .uri("/api/reviews/store/{storeId}", storeId)
                .retrieve()
                .onStatus(
                        status -> status.is4xxClientError() || status.is5xxServerError(),
                        response -> response.bodyToMono(String.class)
                                .flatMap(errorBody -> {
                                    log.error("Error from FastAPI store reviews list: {}", errorBody);
                                    return Mono.error(new RuntimeException(ErrorMessage.ERR_NOT_RESOURCE.name()));
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

    public Mono<ResponseEntity<Object>> getReviewAnalysis(String analysisId) {
        return webClient.get()
                .uri("/api/reviews/analysis/{analysisId}", analysisId)
                .retrieve()
                .onStatus(
                        status -> status.is4xxClientError() || status.is5xxServerError(),
                        response -> response.bodyToMono(String.class)
                                .flatMap(errorBody -> {
                                    log.error("Error from FastAPI review analysis: {}", errorBody);
                                    return Mono.error(new RuntimeException(ErrorMessage.ERR_INTERNAL_SERVER_DECRYPTION_ERROR.name()));
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
}