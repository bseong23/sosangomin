package com.ssafy.sosangomin.api.proxy.chat.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;

public record ChatResponse(
        @Schema(description = "세션 ID", example = "0015e143-9eb0-4b69-a328-2ce7e844f5b6")
        @JsonProperty("session_id")
        String sessionId,

        @Schema(description = "챗봇 응답 메시지", example = "안녕하세요! 무엇을 도와드릴까요?")
        @JsonProperty("bot_message")
        String botMessage,

        @Schema(description = "메시지 타입")
        @JsonProperty("message_type")
        String messageType
) {}