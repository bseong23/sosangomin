package com.ssafy.sosangomin.api.user.domain.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

public record UpdateProfileImgResponseDto(
        @Schema(description = "변경된 이미지 url")
        String profileImgUrl
) {
}
