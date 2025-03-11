package com.ssafy.sosangomin.api.user.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;

public record MailSendRequestDto(
        @Schema(description = "이메일 주소", required = true)
        String mail) {
}
