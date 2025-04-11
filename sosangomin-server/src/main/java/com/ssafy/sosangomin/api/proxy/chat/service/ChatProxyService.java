package com.ssafy.sosangomin.api.proxy.chat.service;

import com.ssafy.sosangomin.api.proxy.chat.dto.ChatRequest;
import com.ssafy.sosangomin.api.proxy.chat.dto.ChatResponse;
import com.ssafy.sosangomin.common.exception.BadRequestException;
import com.ssafy.sosangomin.common.exception.ErrorMessage;
import com.ssafy.sosangomin.common.exception.InternalServerException;
import com.ssafy.sosangomin.common.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatProxyService {

    private final WebClient webClient;

    public Mono<ChatResponse> processChatRequest(ChatRequest request, Long userId) {

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("user_id", userId);
        requestBody.put("message", request.message());
        Optional.ofNullable(request.sessionId())
                .ifPresent(sessionId -> requestBody.put("session_id", sessionId));
        requestBody.put("store_id", request.storeId());

        return webClient.post()
                .uri("/api/chat")
                .bodyValue(requestBody)
                .retrieve()
                .onStatus(
                        status -> status.is4xxClientError() || status.is5xxServerError(),
                        response -> response.bodyToMono(String.class)
                                .flatMap(errorBody -> {
                                    log.error("Error in chat proxy: {}", errorBody);

                                    if (response.statusCode().value() == 404) {
                                        // 404 에러 처리
                                        return Mono.error(new NotFoundException(ErrorMessage.ERR_CHATBOT_SERVICE_NOT_FOUND));
                                    } else if (response.statusCode().is4xxClientError()) {
                                        // 400 에러 처리
                                        if (errorBody.contains("user_id") || errorBody.contains("message")) {
                                            return Mono.error(new BadRequestException(ErrorMessage.ERR_INVALID_CHAT_REQUEST));
                                        } else {
                                            return Mono.error(new BadRequestException(ErrorMessage.ERR_INVALID_REQUEST_FIELD));
                                        }
                                    } else {
                                        // 500 에러 처리
                                        if (errorBody.contains("챗팅 처리 중 오류")) {
                                            return Mono.error(new InternalServerException(ErrorMessage.ERR_CHAT_PROCESSING_ERROR));
                                        } else {
                                            return Mono.error(new InternalServerException(ErrorMessage.ERR_INTERNAL_SERVER_ENCRYPTION_ERROR));
                                        }
                                    }
                                })
                )
                .bodyToMono(ChatResponse.class)
                .doOnSuccess(response -> log.info("Chat response received successfully"));
    }
}