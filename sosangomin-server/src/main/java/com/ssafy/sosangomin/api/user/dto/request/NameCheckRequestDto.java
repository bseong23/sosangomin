package com.ssafy.sosangomin.api.user.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;

public record NameCheckRequestDto(
        @Schema(description = "사용할 닉네임", required = true)
        String name
) {
}
