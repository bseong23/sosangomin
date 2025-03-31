package com.ssafy.sosangomin.api.proxy.analysis.service;

import com.ssafy.sosangomin.api.proxy.analysis.dto.CombinedAnalysisRequest;
import com.ssafy.sosangomin.common.exception.BadRequestException;
import com.ssafy.sosangomin.common.exception.ErrorMessage;
import com.ssafy.sosangomin.common.exception.InternalServerException;
import com.ssafy.sosangomin.common.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Slf4j
@Service
@RequiredArgsConstructor
public class AnalysisProxyService {
    private final WebClient webClient;

    public Mono<Object> analyzeCombinedData(CombinedAnalysisRequest request) {
        return webClient.post()
                .uri("/api/eda/analyze/combined")
                .bodyValue(request)
                .retrieve()
                .onStatus(
                        status -> status.is4xxClientError() || status.is5xxServerError(),
                        response -> response.bodyToMono(String.class)
                                .flatMap(errorBody -> {
                                    log.error("Error from FastAPI combined analysis: {}", errorBody);

                                    if (response.statusCode().is4xxClientError()) {
                                        // 400 에러 처리
                                        if (errorBody.contains("유효하지 않은 source_id")) {
                                            return Mono.error(new BadRequestException(ErrorMessage.ERR_INVALID_SOURCE_ID));
                                        } else {
                                            return Mono.error(new BadRequestException(ErrorMessage.ERR_INVALID_REQUEST_FIELD));
                                        }
                                    } else {
                                        // 500 에러 처리
                                        if (errorBody.contains("종합 분석 중 오류가 발생했습니다")) {
                                            return Mono.error(new InternalServerException(ErrorMessage.ERR_ANALYSIS_PROCESSING_ERROR));
                                        } else {
                                            return Mono.error(new InternalServerException(ErrorMessage.ERR_ANALYZE_BAD_REQUEST));
                                        }
                                    }
                                })
                )
                .bodyToMono(Object.class);
    }

    public Mono<Object> getAnalysisResult(String analysisId) {
        return webClient.get()
                .uri("/api/eda/results/{analysisId}", analysisId)
                .retrieve()
                .onStatus(
                        status -> status.is4xxClientError() || status.is5xxServerError(),
                        response -> response.bodyToMono(String.class)
                                .flatMap(errorBody -> {
                                    log.error("Error from FastAPI get result: {}", errorBody);

                                    if (response.statusCode().value() == 404) {
                                        // 404 에러 - 리소스 없음
                                        return Mono.error(new NotFoundException(ErrorMessage.ERR_ANALYSIS_RESULT_NOT_FOUND));
                                    } else if (response.statusCode().is4xxClientError()) {
                                        // 400 에러 - 잘못된 요청
                                        if (errorBody.contains("유효하지 않은 분석 결과 ID")) {
                                            return Mono.error(new BadRequestException(ErrorMessage.ERR_INVALID_QUERY_PARAMETER));
                                        } else {
                                            return Mono.error(new BadRequestException(ErrorMessage.ERR_INVALID_REQUEST_FIELD));
                                        }
                                    } else {
                                        // 500 에러 - 서버 오류
                                        if (errorBody.contains("EDA 결과 조회 중 오류")) {
                                            return Mono.error(new InternalServerException(ErrorMessage.ERR_ANALYSIS_PROCESSING_ERROR));
                                        } else {
                                            return Mono.error(new InternalServerException(ErrorMessage.ERR_INTERNAL_SERVER_DECRYPTION_ERROR));
                                        }
                                    }
                                })
                )
                .bodyToMono(Object.class);
    }

    public Mono<Object> getAnalysisResultsBySource(String sourceId) {
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/api/eda/results")
                        .queryParam("source_id", sourceId)
                        .build())
                .retrieve()
                .onStatus(
                        status -> status.is4xxClientError() || status.is5xxServerError(),
                        response -> response.bodyToMono(String.class)
                                .flatMap(errorBody -> {
                                    log.error("Error from FastAPI get results by source: {}", errorBody);

                                    if (response.statusCode().is4xxClientError()) {
                                        if (errorBody.contains("유효하지 않은 데이터소스 ID")) {
                                            return Mono.error(new BadRequestException(ErrorMessage.ERR_INVALID_SOURCE_ID));
                                        } else {
                                            return Mono.error(new BadRequestException(ErrorMessage.ERR_INVALID_QUERY_PARAMETER));
                                        }
                                    } else {
                                        if (errorBody.contains("EDA 결과 목록 조회 중 오류")) {
                                            return Mono.error(new InternalServerException(ErrorMessage.ERR_ANALYSIS_RESULTS_LIST_ERROR));
                                        } else {
                                            return Mono.error(new InternalServerException(ErrorMessage.ERR_INTERNAL_SERVER_DECRYPTION_ERROR));
                                        }
                                    }
                                })
                )
                .bodyToMono(Object.class);
    }

    public Mono<Object> getLatestAnalysisResult(String sourceId) {
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/api/eda/latest")
                        .queryParam("source_id", sourceId)
                        .build())
                .retrieve()
                .onStatus(
                        status -> status.is4xxClientError() || status.is5xxServerError(),
                        response -> response.bodyToMono(String.class)
                                .flatMap(errorBody -> {
                                    log.error("Error from FastAPI get latest: {}", errorBody);

                                    if (response.statusCode().value() == 404) {
                                        // 404 에러 - 리소스 없음
                                        if (errorBody.contains("데이터소스") && errorBody.contains("EDA 결과가 없습니다")) {
                                            return Mono.error(new NotFoundException(ErrorMessage.ERR_LATEST_RESULT_NOT_FOUND));
                                        } else {
                                            return Mono.error(new NotFoundException(ErrorMessage.ERR_NOT_RESOURCE));
                                        }
                                    } else if (response.statusCode().is4xxClientError()) {
                                        // 400 에러 - 잘못된 요청
                                        if (errorBody.contains("유효하지 않은 데이터소스 ID")) {
                                            return Mono.error(new BadRequestException(ErrorMessage.ERR_INVALID_SOURCE_ID));
                                        } else {
                                            return Mono.error(new BadRequestException(ErrorMessage.ERR_INVALID_QUERY_PARAMETER));
                                        }
                                    } else {
                                        // 500 에러 - 서버 오류
                                        if (errorBody.contains("최근 EDA 결과 조회 중 오류")) {
                                            return Mono.error(new InternalServerException(ErrorMessage.ERR_ANALYSIS_PROCESSING_ERROR));
                                        } else {
                                            return Mono.error(new InternalServerException(ErrorMessage.ERR_INTERNAL_SERVER_DECRYPTION_ERROR));
                                        }
                                    }
                                })
                )
                .bodyToMono(Object.class);
    }
}