package com.ssafy.sosangomin.api.user.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;

public record UpdateNameRequestDto(
        @Schema(description = "닉네임", required = true)
        String name
) {
}
