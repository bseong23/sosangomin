package com.ssafy.sosangomin.api.proxy.chat.controller;

import com.ssafy.sosangomin.api.proxy.chat.docs.ChatSwagger;
import com.ssafy.sosangomin.api.proxy.chat.dto.ChatRequest;
import com.ssafy.sosangomin.api.proxy.chat.dto.ChatResponse;
import com.ssafy.sosangomin.api.proxy.chat.service.ChatProxyService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@Slf4j
@RestController
@RequestMapping("/api/proxy/chat")
@Tag(name = "채팅 프록시 API", description = "FastAPI 채팅 서비스를 위한 프록시 API")
@RequiredArgsConstructor
public class ChatProxyController implements ChatSwagger {

    private final ChatProxyService chatProxyService;

    @PostMapping
    public Mono<ChatResponse> chat(@RequestBody ChatRequest request) {
        log.info("Received chat request: {}", request);
        return chatProxyService.processChatRequest(request);
    }
}