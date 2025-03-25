package com.ssafy.sosangomin.api.proxy.analysis.controller;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.ssafy.sosangomin.api.proxy.analysis.docs.AnalysisSwagger;
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
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/proxy/analysis")
@Tag(name = "데이터 분석 프록시 API", description = "FastAPI 데이터 분석 서비스를 위한 프록시 API")
public class AnalysisProxyController implements AnalysisSwagger {

    private final WebClient webClient;

    @Autowired
    public AnalysisProxyController(WebClient webClient) {
        this.webClient = webClient;
    }

    @Override
    @PostMapping("")
    public Mono<ResponseEntity<Object>> analyzeCombinedData(@RequestBody CombinedAnalysisRequest request) {
        log.info("Received combined analysis request: {}", request);

        return webClient.post()
                .uri("/api/eda/analyze/combined")
                .bodyValue(request)
                .retrieve()
                .onStatus(
                        status -> status.is4xxClientError() || status.is5xxServerError(),
                        response -> response.bodyToMono(String.class)
                                .flatMap(errorBody -> {
                                    log.error("Error from FastAPI combined analysis: {}", errorBody);
                                    return Mono.error(new RuntimeException("FastAPI 서버 오류: " + errorBody));
                                })
                )
                .bodyToMono(Object.class)
                .map(response -> ResponseEntity.ok().body(response))
                .onErrorResume(e -> {
                    log.error("Error in combined analysis proxy: {}", e.getMessage());

                    HashMap<String, String> errorResponse = new HashMap<>();
                    errorResponse.put("error", "종합 분석 중 오류가 발생했습니다");
                    errorResponse.put("message", e.getMessage());

                    return Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .body((Object)errorResponse));
                });
    }

    @Override
    @GetMapping("/{analysisId}")
    public Mono<ResponseEntity<Object>> getAnalysisResult(
            @PathVariable String analysisId) {
        log.info("Received analysis result request for ID: {}", analysisId);

        return webClient.get()
                .uri("/api/eda/results/{analysisId}", analysisId)
                .retrieve()
                .onStatus(
                        status -> status.is4xxClientError() || status.is5xxServerError(),
                        response -> response.bodyToMono(String.class)
                                .flatMap(errorBody -> {
                                    log.error("Error from FastAPI get result: {}", errorBody);
                                    return Mono.error(new RuntimeException("FastAPI 서버 오류: " + errorBody));
                                })
                )
                .bodyToMono(Object.class)
                .map(response -> ResponseEntity.ok().body(response))
                .onErrorResume(e -> {
                    log.error("Error in get analysis result proxy: {}", e.getMessage());

                    HashMap<String, String> errorResponse = new HashMap<>();
                    errorResponse.put("error", "분석 결과 조회 중 오류가 발생했습니다");
                    errorResponse.put("message", e.getMessage());

                    return Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .body((Object)errorResponse));
                });
    }

    @Override
    @GetMapping("/latest")
    public Mono<ResponseEntity<Object>> getLatestAnalysisResult(
            @RequestParam String sourceId) {
        log.info("Received latest analysis result request for source ID: {}", sourceId);

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
                                    return Mono.error(new RuntimeException("FastAPI 서버 오류: " + errorBody));
                                })
                )
                .bodyToMono(Object.class)
                .map(response -> ResponseEntity.ok().body(response))
                .onErrorResume(e -> {
                    log.error("Error in get latest analysis proxy: {}", e.getMessage());

                    HashMap<String, String> errorResponse = new HashMap<>();
                    errorResponse.put("error", "최신 분석 결과 조회 중 오류가 발생했습니다");
                    errorResponse.put("message", e.getMessage());

                    return Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .body((Object)errorResponse));
                });
    }

    @Data
    public static class CombinedAnalysisRequest {
        @NotNull
        @JsonProperty("store_id")
        private int storeId;

        @NotNull
        @JsonProperty("source_ids")
        private List<String> sourceIds;

        @JsonProperty("pos_type")
        private String posType = "키움";  // 기본값 설정
    }
}