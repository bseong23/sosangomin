package com.ssafy.sosangomin.api.user.domain.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;

public record UpdatePasswordRequestDto(
        @Schema(description = "비밀번호", required = true)
        String password,
        @Schema(description = "이메일", required = true)
        String mail,
        @Schema(description = "인증번호", required = true)
        int userNumber
) {
}
