package com.ssafy.sosangomin.api.user.domain.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;

public record MailDuplicateRequestDto(
        @Schema(description = "사용할 이메일", required = true)
        String mail
) {
}
