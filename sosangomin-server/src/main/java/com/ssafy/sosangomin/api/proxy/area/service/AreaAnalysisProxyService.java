package com.ssafy.sosangomin.api.proxy.area.service;

import com.ssafy.sosangomin.common.exception.BadRequestException;
import com.ssafy.sosangomin.common.exception.ErrorMessage;
import com.ssafy.sosangomin.common.exception.InternalServerException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Slf4j
@Service
@RequiredArgsConstructor
public class AreaAnalysisProxyService {

    private final WebClient webClient;

    public Mono<ResponseEntity<Object>> getSummaryAnalysis(String regionName, String industryName) {
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/api/area-analysis/summary")
                        .queryParam("region_name", regionName)
                        .queryParam("industry_name", industryName)
                        .build())
                .retrieve()
                .onStatus(
                        status -> status.is4xxClientError() || status.is5xxServerError(),
                        response -> response.bodyToMono(String.class)
                                .flatMap(errorBody -> {
                                    log.error("Error from FastAPI area summary analysis: {}", errorBody);

                                    if (response.statusCode().is4xxClientError()) {
                                        if (errorBody.contains("region_name") || errorBody.contains("industry_name")) {
                                            return Mono.error(new BadRequestException(ErrorMessage.ERR_INVALID_AREA_REQUEST));
                                        } else {
                                            return Mono.error(new BadRequestException(ErrorMessage.ERR_INVALID_QUERY_PARAMETER));
                                        }
                                    } else {
                                        if (errorBody.contains("상권 분석 중 오류")) {
                                            return Mono.error(new InternalServerException(ErrorMessage.ERR_AREA_ANALYSIS_PROCESSING_ERROR));
                                        } else {
                                            return Mono.error(new InternalServerException(ErrorMessage.ERR_INTERNAL_SERVER_ERROR));
                                        }
                                    }
                                })
                )
                .bodyToMono(Object.class)
                .map(ResponseEntity::ok);
    }

    public Mono<ResponseEntity<Object>> getPopulationAnalysis(String regionName) {
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/api/area-analysis/population")
                        .queryParam("region_name", regionName)
                        .build())
                .retrieve()
                .onStatus(
                        status -> status.is4xxClientError() || status.is5xxServerError(),
                        response -> response.bodyToMono(String.class)
                                .flatMap(errorBody -> {
                                    log.error("Error from FastAPI population analysis: {}", errorBody);

                                    if (response.statusCode().is4xxClientError()) {
                                        if (errorBody.contains("region_name")) {
                                            return Mono.error(new BadRequestException(ErrorMessage.ERR_INVALID_REGION_NAME));
                                        } else {
                                            return Mono.error(new BadRequestException(ErrorMessage.ERR_INVALID_QUERY_PARAMETER));
                                        }
                                    } else {
                                        if (errorBody.contains("인구 분석 중 오류")) {
                                            return Mono.error(new InternalServerException(ErrorMessage.ERR_POPULATION_ANALYSIS_PROCESSING_ERROR));
                                        } else {
                                            return Mono.error(new InternalServerException(ErrorMessage.ERR_INTERNAL_SERVER_ERROR));
                                        }
                                    }
                                })
                )
                .bodyToMono(Object.class)
                .map(ResponseEntity::ok);
    }

    public Mono<ResponseEntity<Object>> getCategoryAnalysis(String regionName, String industryName) {
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/api/area-analysis/category")
                        .queryParam("region_name", regionName)
                        .queryParam("industry_name", industryName)
                        .build())
                .retrieve()
                .onStatus(
                        status -> status.is4xxClientError() || status.is5xxServerError(),
                        response -> response.bodyToMono(String.class)
                                .flatMap(errorBody -> {
                                    log.error("Error from FastAPI category analysis: {}", errorBody);

                                    if (response.statusCode().is4xxClientError()) {
                                        return Mono.error(new BadRequestException(ErrorMessage.ERR_INVALID_QUERY_PARAMETER));
                                    } else {
                                        if (errorBody.contains("업종 분석 중 오류")) {
                                            return Mono.error(new InternalServerException(ErrorMessage.ERR_STORE_ANALYSIS_PROCESSING_ERROR));
                                        } else {
                                            return Mono.error(new InternalServerException(ErrorMessage.ERR_INTERNAL_SERVER_ERROR));
                                        }
                                    }
                                })
                )
                .bodyToMono(Object.class)
                .map(ResponseEntity::ok);
    }

    public Mono<ResponseEntity<Object>> getSalesAnalysis(String regionName, String industryName) {
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/api/area-analysis/sales")
                        .queryParam("region_name", regionName)
                        .queryParam("industry_name", industryName)
                        .build())
                .retrieve()
                .onStatus(
                        status -> status.is4xxClientError() || status.is5xxServerError(),
                        response -> response.bodyToMono(String.class)
                                .flatMap(errorBody -> {
                                    log.error("Error from FastAPI sales analysis: {}", errorBody);

                                    if (response.statusCode().is4xxClientError()) {
                                        return Mono.error(new BadRequestException(ErrorMessage.ERR_INVALID_QUERY_PARAMETER));
                                    } else {
                                        if (errorBody.contains("매출 분석 중 오류")) {
                                            return Mono.error(new InternalServerException(ErrorMessage.ERR_SALES_ANALYSIS_PROCESSING_ERROR));
                                        } else {
                                            return Mono.error(new InternalServerException(ErrorMessage.ERR_INTERNAL_SERVER_ERROR));
                                        }
                                    }
                                })
                )
                .bodyToMono(Object.class)
                .map(ResponseEntity::ok);
    }
}