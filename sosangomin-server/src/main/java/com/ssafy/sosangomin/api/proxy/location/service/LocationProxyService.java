package com.ssafy.sosangomin.api.proxy.location.service;

import com.ssafy.sosangomin.api.proxy.location.dto.LocationRecommendRequest;
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
public class LocationProxyService {

    private final WebClient webClient;

    public Mono<ResponseEntity<Object>> recommendLocation(LocationRecommendRequest request) {
        return webClient.post()
                .uri("/api/location/recommend")
                .bodyValue(request)
                .retrieve()
                .onStatus(
                        status -> status.is4xxClientError() || status.is5xxServerError(),
                        response -> response.bodyToMono(String.class)
                                .flatMap(errorBody -> {
                                    log.error("Error from FastAPI location recommendation: {}", errorBody);

                                    if (response.statusCode().is4xxClientError()) {
                                        return Mono.error(new BadRequestException(ErrorMessage.ERR_INVALID_REQUEST_FIELD));
                                    } else {
                                        return Mono.error(new InternalServerException(ErrorMessage.ERR_INTERNAL_SERVER_ERROR));
                                    }
                                })
                )
                .bodyToMono(Object.class)
                .map(ResponseEntity::ok);
    }

    public Mono<ResponseEntity<Object>> recommendMapLocations(LocationRecommendRequest request) {
        return webClient.post()
                .uri("/api/location/map")
                .bodyValue(request)
                .retrieve()
                .onStatus(
                        status -> status.is4xxClientError() || status.is5xxServerError(),
                        response -> response.bodyToMono(String.class)
                                .flatMap(errorBody -> {
                                    log.error("Error from FastAPI map location recommendation: {}", errorBody);

                                    if (response.statusCode().is4xxClientError()) {
                                        return Mono.error(new BadRequestException(ErrorMessage.ERR_INVALID_REQUEST_FIELD));
                                    } else {
                                        return Mono.error(new InternalServerException(ErrorMessage.ERR_INTERNAL_SERVER_ERROR));
                                    }
                                })
                )
                .bodyToMono(Object.class)
                .map(ResponseEntity::ok);
    }
}