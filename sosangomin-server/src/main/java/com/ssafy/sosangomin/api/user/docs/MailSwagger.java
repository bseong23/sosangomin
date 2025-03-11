package com.ssafy.sosangomin.api.user.docs;

import com.ssafy.sosangomin.api.user.dto.request.MailCheckRequestDto;
import com.ssafy.sosangomin.api.user.dto.request.MailSendRequestDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ModelAttribute;

public interface MailSwagger {

    @Operation(
            summary = "메일 인증용 이메일 발송",
            description = "메일 인증을 위한 이메일을 발송합니다. 사용자의 이메일 주소가 필요합니다."
    )
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "메일 발송 성공"
                    ),
                    @ApiResponse(
                            responseCode = "500",
                            description = "메일 발송 실패",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(
                                            type = "object",
                                            example = "{\n" +
                                                    "  \"status\": \"500\",\n" +
                                                    "  \"errorMessage\": \"ERR_INTERNAL_SERVER_MAIL_SEND_FAIL_ERROR\"\n" +
                                                    "}"
                                    )
                            )
                    )
            }
    )
    ResponseEntity<?> mailSend(
            @ParameterObject
            @ModelAttribute MailSendRequestDto mailSendRequestDto
    );

    @Operation(
            summary = "메일 인증번호 확인",
            description = "메일 인증번호를 확인합니다. 이메일 주소와 인증번호가 필요합니다."
    )
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "메일 인증 성공"
                    ),
                    @ApiResponse(
                            responseCode = "400",
                            description = "메일 인증 실패",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(
                                            type = "object",
                                            example = "{\n" +
                                                    "  \"status\": \"400\",\n" +
                                                    "  \"errorMessage\": \"ERR_INVALID_MAIL_NUMBER\"\n" +
                                                    "}"
                                    )
                            )
                    )
            }
    )
    ResponseEntity<?> mailCheck(
            @ParameterObject
            @ModelAttribute MailCheckRequestDto mailCheckRequestDto
    );
}
