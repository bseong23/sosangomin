package com.ssafy.sosangomin.api.proxy.chat.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class ChatResponse {
    @JsonProperty("session_id")
    private String sessionId;

    @JsonProperty("bot_message")
    private String botMessage;

    @JsonProperty("message_type")
    private String messageType;
}