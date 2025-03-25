package com.ssafy.sosangomin.api.proxy.chat.controller;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.ssafy.sosangomin.api.proxy.chat.docs.ChatSwagger;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import jakarta.validation.constraints.NotNull;

@Slf4j
@RestController
@RequestMapping("/api/proxy/chat")
@Tag(name = "채팅 프록시 API", description = "FastAPI 채팅 서비스를 위한 프록시 API")
public class ChatProxyController implements ChatSwagger {

    private final WebClient webClient;

    @Autowired
    public ChatProxyController(WebClient webClient) {
        this.webClient = webClient;
    }

    @Override
    @PostMapping
    public Mono<ChatResponse> chat(@RequestBody ChatRequest request) {
        log.info("Received chat request: {}", request);

        return webClient.post()
                .uri("/api/chat")
                .bodyValue(request)
                .retrieve()
                .bodyToMono(ChatResponse.class)
                .doOnSuccess(response -> log.info("Chat response received successfully"))
                .doOnError(error -> log.error("Error in chat proxy: {}", error.getMessage()));
    }

    @Data
    public static class ChatRequest {
        @NotNull
        @JsonProperty("user_id")
        private int userId;

        @NotNull
        @JsonProperty("message")
        private String message;

        @JsonProperty("session_id")
        private String sessionId;

        @JsonProperty("store_id")
        private Integer storeId;
    }

    @Data
    public static class ChatResponse {
        @JsonProperty("session_id")
        private String sessionId;

        @JsonProperty("bot_message")
        private String botMessage;

        @JsonProperty("message_type")
        private String messageType;
    }
}