package com.ssafy.sosangomin.api.notice.docs;

import com.ssafy.sosangomin.api.board.domain.dto.response.BoardInsertResponseDto;
import com.ssafy.sosangomin.api.notice.domain.dto.request.NoticeInsertRequestDto;
import com.ssafy.sosangomin.api.notice.domain.dto.response.NoticeInsertResponseDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;

import java.security.Principal;

public interface NoticeSwagger {

    @Operation(
            summary = "공지사항 등록",
            description = "공지사항을 등록합니다. 공지사항 제목, 곶지사항 본문이 필요합니다 .액세스 토큰이 필요합니다. 유저의 역할이 ADMIN 이어야합니다."
    )
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "공지사항 등록 성공",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = NoticeInsertResponseDto.class)
                            )
                    ),
                    @ApiResponse(
                            responseCode = "401",
                            description = "ADMIN 유저가 아닙니다.",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(
                                            type = "object",
                                            example = "{\n" +
                                                    "  \"status\": \"401\",\n" +
                                                    "  \"errorMessage\": \"ERR_NOT_ALLOWD_USER\"\n" +
                                                    "}"
                                    )
                            )
                    )
            }
    )
    public ResponseEntity<?> insertNotice(@RequestBody NoticeInsertRequestDto noticeInsertRequestDto,
                                          Principal principal);
}
