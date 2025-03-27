package com.ssafy.sosangomin.api.proxy.chat.service;

import com.ssafy.sosangomin.api.proxy.chat.dto.ChatRequest;
import com.ssafy.sosangomin.api.proxy.chat.dto.ChatResponse;
import com.ssafy.sosangomin.common.exception.ErrorMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatProxyService {

    private final WebClient webClient;

    public Mono<ChatResponse> processChatRequest(ChatRequest request) {
        return webClient.post()
                .uri("/api/chat")
                .bodyValue(request)
                .retrieve()
                .onStatus(
                        status -> status.is4xxClientError() || status.is5xxServerError(),
                        response -> response.bodyToMono(String.class)
                                .flatMap(errorBody -> {
                                    log.error("Error in chat proxy: {}", errorBody);
                                    return Mono.error(new RuntimeException(ErrorMessage.ERR_INTERNAL_SERVER_ENCRYPTION_ERROR.name()));
                                })
                )
                .bodyToMono(ChatResponse.class)
                .doOnSuccess(response -> log.info("Chat response received successfully"));
    }
}