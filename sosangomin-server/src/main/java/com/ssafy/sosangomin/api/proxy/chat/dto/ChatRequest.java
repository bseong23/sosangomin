package com.ssafy.sosangomin.api.proxy.chat.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;

import jakarta.validation.constraints.NotNull;

public record ChatRequest(
        @Schema(description = "사용자 ID", required = true, example = "1")
        @NotNull
        @JsonProperty("user_id")
        int userId,

        @Schema(description = "채팅 메시지", required = true, example = "안녕하세요, 질문이 있어요")
        @NotNull
        @JsonProperty("message")
        String message,

        @Schema(description = "세션 ID (신규 세션 생성 시 null)", example = "0015e143-9eb0-4b69-a328-2ce7e844f5b6")
        @JsonProperty("session_id")
        String sessionId,

        @Schema(description = "매장 ID (선택사항)", example = "1")
        @JsonProperty("store_id")
        Integer storeId
) {}