package com.ssafy.sosangomin.api.proxy.review.service;

import com.ssafy.sosangomin.api.proxy.review.dto.ReviewAnalysisRequest;
import com.ssafy.sosangomin.common.exception.BadRequestException;
import com.ssafy.sosangomin.common.exception.ErrorMessage;
import com.ssafy.sosangomin.common.exception.InternalServerException;
import com.ssafy.sosangomin.common.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

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

                                    if (response.statusCode().is4xxClientError()) {
                                        if (errorBody.contains("place_id") || errorBody.contains("store_id")) {
                                            return Mono.error(new BadRequestException(ErrorMessage.ERR_INVALID_REVIEW_REQUEST));
                                        } else {
                                            return Mono.error(new BadRequestException(ErrorMessage.ERR_INVALID_REQUEST_FIELD));
                                        }
                                    } else {
                                        if (errorBody.contains("리뷰 분석 중 오류")) {
                                            return Mono.error(new InternalServerException(ErrorMessage.ERR_REVIEW_ANALYSIS_PROCESSING_ERROR));
                                        } else {
                                            return Mono.error(new InternalServerException(ErrorMessage.ERR_INTERNAL_SERVER_DECRYPTION_ERROR));
                                        }
                                    }
                                })
                )
                .bodyToMono(Object.class)
                .map(ResponseEntity::ok);
    }

    public Mono<ResponseEntity<Object>> getStoreReviewsList(Long storeId) {
        return webClient.get()
                .uri("/api/reviews/store/{storeId}", storeId)
                .retrieve()
                .onStatus(
                        status -> status.is4xxClientError() || status.is5xxServerError(),
                        response -> response.bodyToMono(String.class)
                                .flatMap(errorBody -> {
                                    log.error("Error from FastAPI store reviews list: {}", errorBody);

                                    if (response.statusCode().is4xxClientError()) {
                                        if (errorBody.contains("status") && errorBody.contains("error")) {
                                            return Mono.error(new BadRequestException(ErrorMessage.ERR_INVALID_STORE_ID));
                                        } else {
                                            return Mono.error(new BadRequestException(ErrorMessage.ERR_INVALID_QUERY_PARAMETER));
                                        }
                                    } else {
                                        if (errorBody.contains("매장 리뷰 분석 목록 조회 중 오류")) {
                                            return Mono.error(new InternalServerException(ErrorMessage.ERR_REVIEW_LIST_PROCESSING_ERROR));
                                        } else {
                                            return Mono.error(new InternalServerException(ErrorMessage.ERR_INTERNAL_SERVER_DECRYPTION_ERROR));
                                        }
                                    }
                                })
                )
                .bodyToMono(Object.class)
                .map(ResponseEntity::ok);
    }

    public Mono<ResponseEntity<Object>> getReviewAnalysis(String analysisId) {
        return webClient.get()
                .uri("/api/reviews/analysis/{analysisId}", analysisId)
                .retrieve()
                .onStatus(
                        status -> status.is4xxClientError() || status.is5xxServerError(),
                        response -> response.bodyToMono(String.class)
                                .flatMap(errorBody -> {
                                    log.error("Error from FastAPI review analysis result: {}", errorBody);

                                    if (response.statusCode().value() == 404) {
                                        return Mono.error(new NotFoundException(ErrorMessage.ERR_REVIEW_ANALYSIS_NOT_FOUND));
                                    } else if (response.statusCode().is4xxClientError()) {
                                        return Mono.error(new BadRequestException(ErrorMessage.ERR_INVALID_ANALYSIS_ID));
                                    } else {
                                        if (errorBody.contains("분석 결과 조회 중 오류")) {
                                            return Mono.error(new InternalServerException(ErrorMessage.ERR_REVIEW_RESULT_PROCESSING_ERROR));
                                        } else {
                                            return Mono.error(new InternalServerException(ErrorMessage.ERR_INTERNAL_SERVER_DECRYPTION_ERROR));
                                        }
                                    }
                                })
                )
                .bodyToMono(Object.class)
                .map(ResponseEntity::ok);
    }
}