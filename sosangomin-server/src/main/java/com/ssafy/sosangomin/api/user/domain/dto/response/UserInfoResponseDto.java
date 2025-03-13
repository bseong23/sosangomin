package com.ssafy.sosangomin.api.user.domain.dto.response;

import com.ssafy.sosangomin.api.user.domain.entity.UserType;
import io.swagger.v3.oas.annotations.media.Schema;

public record UserInfoResponseDto(
        @Schema(description = "유저의 회원가입 타입 (일반로그인, 카카오로그인)")
        UserType userType,
        @Schema(description = "이메일 (카카오 로그인의 경우 null)")
        String mail,
        @Schema(description = "유저 닉네임")
        String name,
        @Schema(description = "유저 프로필 사진 url, null일 수 있음")
        String userProfileUrl
) {
}
