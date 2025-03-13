package com.ssafy.sosangomin.api.user.domain.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;

public record MailCheckRequestDto(
        @Schema(description = "이메일 주소", required = true)
        String mail,
        @Schema(description = "인증번호", required = true)
        int userNumber) {
}
