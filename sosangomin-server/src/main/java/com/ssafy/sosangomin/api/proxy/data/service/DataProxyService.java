package com.ssafy.sosangomin.api.proxy.data.service;

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
public class DataProxyService {

    private final WebClient webClient;

    public Mono<ResponseEntity<Object>> getDataSources(Long storeId) {
        return webClient.get()
                .uri(uriBuilder -> {
                    var builder = uriBuilder.path("/api/data/datasources");
                    if (storeId != null) {
                        builder.queryParam("store_id", storeId);
                    }
                    return builder.build();
                })
                .retrieve()
                .onStatus(
                        status -> status.is4xxClientError() || status.is5xxServerError(),
                        response -> response.bodyToMono(String.class)
                                .flatMap(errorBody -> {
                                    log.error("Error from FastAPI data sources list: {}", errorBody);

                                    if (response.statusCode().is4xxClientError()) {
                                        if (errorBody.contains("store_id")) {
                                            return Mono.error(new BadRequestException(ErrorMessage.ERR_INVALID_STORE_ID));
                                        } else {
                                            return Mono.error(new BadRequestException(ErrorMessage.ERR_INVALID_QUERY_PARAMETER));
                                        }
                                    } else {
                                        if (errorBody.contains("데이터소스 목록 조회 중 오류")) {
                                            return Mono.error(new InternalServerException(ErrorMessage.ERR_DATASOURCE_LIST_PROCESSING_ERROR));
                                        } else {
                                            return Mono.error(new InternalServerException(ErrorMessage.ERR_INTERNAL_SERVER_DECRYPTION_ERROR));
                                        }
                                    }
                                })
                )
                .bodyToMono(Object.class)
                .map(ResponseEntity::ok);
    }

    public Mono<ResponseEntity<Object>> getDataSource(String sourceId) {
        return webClient.get()
                .uri("/api/data/datasources/{sourceId}", sourceId)
                .retrieve()
                .onStatus(
                        status -> status.is4xxClientError() || status.is5xxServerError(),
                        response -> response.bodyToMono(String.class)
                                .flatMap(errorBody -> {
                                    log.error("Error from FastAPI get data source: {}", errorBody);

                                    if (response.statusCode().value() == 404) {
                                        return Mono.error(new NotFoundException(ErrorMessage.ERR_DATASOURCE_NOT_FOUND));
                                    } else if (response.statusCode().is4xxClientError()) {
                                        if (errorBody.contains("유효하지 않은 데이터소스 ID")) {
                                            return Mono.error(new BadRequestException(ErrorMessage.ERR_INVALID_SOURCE_ID));
                                        } else {
                                            return Mono.error(new BadRequestException(ErrorMessage.ERR_INVALID_QUERY_PARAMETER));
                                        }
                                    } else {
                                        if (errorBody.contains("데이터소스 조회 중 오류")) {
                                            return Mono.error(new InternalServerException(ErrorMessage.ERR_DATASOURCE_PROCESSING_ERROR));
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