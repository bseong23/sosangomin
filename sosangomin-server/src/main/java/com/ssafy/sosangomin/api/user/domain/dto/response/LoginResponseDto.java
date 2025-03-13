package com.ssafy.sosangomin.api.user.domain.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;

public record LoginResponseDto(
        @Schema(description = "JWT 엑세스 토큰")
        String accessToken,
        @Schema(description = "유저 닉네임")
        String userName,
        @Schema(description = "유저 프로필 사진 url, null일 수 있음")
        String userProfileUrl,
        @Schema(description = "첫 로그인인지 여부, 일반 로그인은 디폴트로 false")
        String isFirstLogin,
        @Schema(description = "암호화된 유저 id (pk)")
        String userId
) {
}
