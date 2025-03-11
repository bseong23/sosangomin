package com.ssafy.sosangomin.api.user.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;

public record LoginRequestDto(
        @Schema(description = "이메일 주소", required = true)
        String mail,
        @Schema(description = "비밀번호", required = true)
        String password
) {
}
