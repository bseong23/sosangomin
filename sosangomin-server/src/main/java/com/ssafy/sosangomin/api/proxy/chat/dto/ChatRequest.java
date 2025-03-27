package com.ssafy.sosangomin.api.proxy.chat.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import jakarta.validation.constraints.NotNull;

@Data
public class ChatRequest {
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