package com.ssafy.sosangomin.api.user.docs;

import com.ssafy.sosangomin.api.user.dto.request.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ModelAttribute;

import java.security.Principal;

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

    @Operation(
            summary = "로그인",
            description = "로그인을합니다. 이메일과 비밀번호가 필요합니다."
    )
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "로그인 성공"
                    ),
                    @ApiResponse(
                            responseCode = "400",
                            description = "로그인 실패 - 존재하지 않는 이메일 이거나, 비밀번호 실패",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(
                                            type = "object",
                                            example = "{\n" +
                                                    "  \"status\": \"400\",\n" +
                                                    "  \"errorMessage\": \"ERR_LOGIN_FAILED\"\n" +
                                                    "}"
                                    )
                            )
                    )
            }
    )
    ResponseEntity<?> login(
            @ParameterObject
            @ModelAttribute LoginRequestDto loginRequestDto
    );

    @Operation(
            summary = "이메일 중복 체크",
            description = "이메일 중복 체크를 합니다. 확인할 이메일이 필요합니다."
    )
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "사용가능한 이메일"
                    ),
                    @ApiResponse(
                            responseCode = "400",
                            description = "이미 존재하는 이메일",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(
                                            type = "object",
                                            example = "{\n" +
                                                    "  \"status\": \"400\",\n" +
                                                    "  \"errorMessage\": \"ERR_EMAIL_DUPLICATE\"\n" +
                                                    "}"
                                    )
                            )
                    )
            }
    )
    ResponseEntity<?> checkEmail(
            @ParameterObject
            @ModelAttribute EmailCheckRequestDto emailCheckRequestDto
    );

    @Operation(
            summary = "닉네임 변경",
            description = "닉네임을 변경합니다. 자동으로 중복을 감지합니다. 변경할 닉네임이 필요합니다. 요청시 액세스 토큰이 필요합니다."
    )
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "닉네임 변경 성공"
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
    ResponseEntity<?> updateName(
            Principal principal,
            @ParameterObject
            @ModelAttribute UpdateNameRequestDto updateNameRequestDto
    );

    @Operation(
            summary = "비밀번호 번경",
            description = "비밀번호를 변경합니다. 변경할 비밀번호가 필요합니다. 요청시 액세스 토큰이 필요합니다."
    )
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "비밀번호 변경 성공"
                    )
            }
    )
    ResponseEntity<?> updatePassword(
            Principal principal,
            @ParameterObject
            @ModelAttribute UpdatePasswordRequestDto updatePasswordRequestDto
    );
}
