package com.ssafy.sosangomin.api.proxy.finalreport.service;

import com.ssafy.sosangomin.api.proxy.finalreport.dto.FinalReportRequest;
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
public class FinalReportProxyService {

    private final WebClient webClient;

    public Mono<ResponseEntity<Object>> getStoreReportsList(Long storeId) {
        return webClient.get()
                .uri("/api/final-reports/list/{storeId}", storeId)
                .retrieve()
                .onStatus(
                        status -> status.is4xxClientError() || status.is5xxServerError(),
                        response -> response.bodyToMono(String.class)
                                .flatMap(errorBody -> {
                                    log.error("Error from FastAPI store reports list: {}", errorBody);

                                    if (response.statusCode().is4xxClientError()) {
                                        return Mono.error(new BadRequestException(ErrorMessage.ERR_INVALID_STORE_ID));
                                    } else {
                                        if (errorBody.contains("보고서 목록 조회 중 오류")) {
                                            return Mono.error(new InternalServerException(ErrorMessage.ERR_REPORT_LIST_PROCESSING_ERROR));
                                        } else {
                                            return Mono.error(new InternalServerException(ErrorMessage.ERR_INTERNAL_SERVER_ERROR));
                                        }
                                    }
                                })
                )
                .bodyToMono(Object.class)
                .map(ResponseEntity::ok);
    }

    public Mono<ResponseEntity<Object>> getFinalReport(String reportId) {
        return webClient.get()
                .uri("/api/final-reports/{reportId}", reportId)
                .retrieve()
                .onStatus(
                        status -> status.is4xxClientError() || status.is5xxServerError(),
                        response -> response.bodyToMono(String.class)
                                .flatMap(errorBody -> {
                                    log.error("Error from FastAPI final report: {}", errorBody);

                                    if (response.statusCode().value() == 404) {
                                        return Mono.error(new NotFoundException(ErrorMessage.ERR_REPORT_NOT_FOUND));
                                    } else if (response.statusCode().is4xxClientError()) {
                                        return Mono.error(new BadRequestException(ErrorMessage.ERR_INVALID_REPORT_ID));
                                    } else {
                                        if (errorBody.contains("보고서 조회 중 오류")) {
                                            return Mono.error(new InternalServerException(ErrorMessage.ERR_REPORT_PROCESSING_ERROR));
                                        } else {
                                            return Mono.error(new InternalServerException(ErrorMessage.ERR_INTERNAL_SERVER_ERROR));
                                        }
                                    }
                                })
                )
                .bodyToMono(Object.class)
                .map(ResponseEntity::ok);
    }

    public Mono<ResponseEntity<Object>> generateFinalReport(FinalReportRequest request) {
        return webClient.post()
                .uri("/api/final-reports")
                .bodyValue(request)
                .retrieve()
                .onStatus(
                        status -> status.is4xxClientError() || status.is5xxServerError(),
                        response -> response.bodyToMono(String.class)
                                .flatMap(errorBody -> {
                                    log.error("Error from FastAPI generate final report: {}", errorBody);

                                    if (response.statusCode().is4xxClientError()) {
                                        return Mono.error(new BadRequestException(ErrorMessage.ERR_INVALID_STORE_ID));
                                    } else {
                                        if (errorBody.contains("보고서 생성 중 오류")) {
                                            return Mono.error(new InternalServerException(ErrorMessage.ERR_REPORT_GENERATION_ERROR));
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