package com.ssafy.sosangomin.api.user.docs;

import com.ssafy.sosangomin.api.user.dto.request.NameCheckRequestDto;
import com.ssafy.sosangomin.api.user.dto.request.SignUpRequestDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ModelAttribute;

public interface UserSwagger {

    @Operation(
            summary = "닉네임 중복 체크",
            description = "닉네임 중복 체크를 합니다. 확인할 닉네임이 필요합니다."
    )
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "사용 가능한 닉네임"
                    ),
                    @ApiResponse(
                            responseCode = "400",
                            description = "이미 존재하는 닉네임",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(
                                            type = "object",
                                            example = "{\n" +
                                                    "  \"status\": \"400\",\n" +
                                                    "  \"errorMessage\": \"ERR_NAME_DUPLICATE\"\n" +
                                                    "}"
                                    )
                            )
                    )
            }
    )
    ResponseEntity<?> checkName(
            @ParameterObject
            @ModelAttribute NameCheckRequestDto nameCheckRequestDto
    );

    @Operation(
            summary = "회원가입",
            description = "회원가입을 합니다. 인증된 이메일, 중복되지 않은 닉네임, 비밀번호가 필요합니다."
    )
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "회원가입 성공"
                    )
            }
    )
    ResponseEntity<?> signUp(
            @ParameterObject
            @ModelAttribute SignUpRequestDto signUpRequestDto
    );
}
