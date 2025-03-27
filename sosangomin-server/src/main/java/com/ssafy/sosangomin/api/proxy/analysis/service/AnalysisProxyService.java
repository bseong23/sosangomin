package com.ssafy.sosangomin.api.proxy.analysis.service;

import com.ssafy.sosangomin.api.proxy.analysis.dto.CombinedAnalysisRequest;
import com.ssafy.sosangomin.common.exception.ErrorMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.HashMap;

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
                                    return Mono.error(new RuntimeException(ErrorMessage.ERR_INTERNAL_SERVER_ENCRYPTION_ERROR.name()));
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
                                    return Mono.error(new RuntimeException(ErrorMessage.ERR_NOT_RESOURCE.name()));
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
                                    return Mono.error(new RuntimeException(ErrorMessage.ERR_INTERNAL_SERVER_DECRYPTION_ERROR.name()));
                                })
                )
                .bodyToMono(Object.class);
    }
}