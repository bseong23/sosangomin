package com.ssafy.sosangomin.api.proxy.competitor.service;

import com.ssafy.sosangomin.api.proxy.competitor.dto.CompetitorAnalysisRequest;
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
public class CompetitorProxyService {

    private final WebClient webClient;

    public Mono<ResponseEntity<Object>> getStoreComparisonList(Long storeId) {
        return webClient.get()
                .uri("/api/competitor/{storeId}", storeId)
                .retrieve()
                .onStatus(
                        status -> status.is4xxClientError() || status.is5xxServerError(),
                        response -> response.bodyToMono(String.class)
                                .flatMap(errorBody -> {
                                    log.error("Error from FastAPI competitor comparison list: {}", errorBody);

                                    if (response.statusCode().value() == 404) {
                                        return Mono.error(new NotFoundException(ErrorMessage.ERR_COMPETITOR_COMPARISON_NOT_FOUND));
                                    } else if (response.statusCode().is4xxClientError()) {
                                        if (errorBody.contains("status") && errorBody.contains("error")) {
                                            return Mono.error(new BadRequestException(ErrorMessage.ERR_INVALID_STORE_ID));
                                        } else {
                                            return Mono.error(new BadRequestException(ErrorMessage.ERR_INVALID_REQUEST_FIELD));
                                        }
                                    } else {
                                        if (errorBody.contains("비교 분석 목록 조회 중 오류")) {
                                            return Mono.error(new InternalServerException(ErrorMessage.ERR_COMPETITOR_COMPARISON_PROCESSING_ERROR));
                                        } else {
                                            return Mono.error(new InternalServerException(ErrorMessage.ERR_INTERNAL_SERVER_DECRYPTION_ERROR));
                                        }
                                    }
                                })
                )
                .bodyToMono(Object.class)
                .map(ResponseEntity::ok);
    }

    public Mono<ResponseEntity<Object>> oneClickAnalyzeCompetitor(CompetitorAnalysisRequest request) {
        return webClient.post()
                .uri("/api/competitor/analyze")
                .bodyValue(request)
                .retrieve()
                .onStatus(
                        status -> status.is4xxClientError() || status.is5xxServerError(),
                        response -> response.bodyToMono(String.class)
                                .flatMap(errorBody -> {
                                    log.error("Error from FastAPI competitor analysis: {}", errorBody);

                                    if (response.statusCode().is4xxClientError()) {
                                        if (errorBody.contains("경쟁사의 네이버 플레이스 ID를 찾을 수 없습니다")) {
                                            return Mono.error(new BadRequestException(ErrorMessage.ERR_COMPETITOR_NOT_FOUND));
                                        } else if (errorBody.contains("내 매장의 리뷰 분석 결과가 없습니다")) {
                                            return Mono.error(new BadRequestException(ErrorMessage.ERR_MY_STORE_ANALYSIS_NOT_FOUND));
                                        } else {
                                            return Mono.error(new BadRequestException(ErrorMessage.ERR_INVALID_REQUEST_FIELD));
                                        }
                                    } else {
                                        if (errorBody.contains("원클릭 경쟁사 분석 중 오류")) {
                                            return Mono.error(new InternalServerException(ErrorMessage.ERR_COMPETITOR_ANALYSIS_PROCESSING_ERROR));
                                        } else {
                                            return Mono.error(new InternalServerException(ErrorMessage.ERR_INTERNAL_SERVER_DECRYPTION_ERROR));
                                        }
                                    }
                                })
                )
                .bodyToMono(Object.class)
                .map(ResponseEntity::ok);
    }

    public Mono<ResponseEntity<Object>> getComparisonResult(String comparisonId) {
        return webClient.get()
                .uri("/api/competitor/comparison/{comparisonId}", comparisonId)
                .retrieve()
                .onStatus(
                        status -> status.is4xxClientError() || status.is5xxServerError(),
                        response -> response.bodyToMono(String.class)
                                .flatMap(errorBody -> {
                                    log.error("Error from FastAPI comparison result: {}", errorBody);

                                    if (response.statusCode().value() == 404) {
                                        return Mono.error(new NotFoundException(ErrorMessage.ERR_COMPARISON_RESULT_NOT_FOUND));
                                    } else if (response.statusCode().is4xxClientError()) {
                                        return Mono.error(new BadRequestException(ErrorMessage.ERR_INVALID_COMPARISON_ID));
                                    } else {
                                        if (errorBody.contains("비교 분석 결과 조회 중 오류")) {
                                            return Mono.error(new InternalServerException(ErrorMessage.ERR_COMPARISON_RESULT_PROCESSING_ERROR));
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