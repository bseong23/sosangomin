package com.ssafy.sosangomin.api.notice.docs;

import com.ssafy.sosangomin.api.news.domain.dto.response.PageCountResponseDto;
import com.ssafy.sosangomin.api.notice.domain.dto.request.NoticeInsertRequestDto;
import com.ssafy.sosangomin.api.notice.domain.dto.request.NoticeUpdateRequestDto;
import com.ssafy.sosangomin.api.notice.domain.dto.response.NoticeInsertResponseDto;
import com.ssafy.sosangomin.api.notice.domain.dto.response.NoticeResponseDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import java.security.Principal;
import java.util.List;

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

    @Operation(
            summary = "단일 공지글 반환",
            description = "단일 공지글을 반환합니다. 공지글 id가 필요합니다. 조회수가 증가합니다."
    )
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "단일 공지글 반환 성공",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = NoticeResponseDto.class)
                            )
                    ),
                    @ApiResponse(
                            responseCode = "404",
                            description = "없는 공지글 id 입니다.",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(
                                            type = "object",
                                            example = "{\n" +
                                                    "  \"status\": \"404\",\n" +
                                                    "  \"errorMessage\": \"ERR_NOTICE_NOT_FOUND\"\n" +
                                                    "}"
                                    )
                            )
                    )
            }
    )
    ResponseEntity<?> getNotice(@PathVariable Long noticeId);

    @Operation(
            summary = "공지글 수정",
            description = "공지글을 수정합니다. 수정할 제목과 내용이 필요합니다. 액세스 토큰이 필요합니다."
    )
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "공지글 수정 성공."
                    ),
                    @ApiResponse(
                            responseCode = "401",
                            description = "공지글을 수정할 자격이 없습니다.",
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
                    ),
                    @ApiResponse(
                            responseCode = "404",
                            description = "없는 공지글 id 입니다.",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(
                                            type = "object",
                                            example = "{\n" +
                                                    "  \"status\": \"404\",\n" +
                                                    "  \"errorMessage\": \"ERR_NOTICE_NOT_FOUND\"\n" +
                                                    "}"
                                    )
                            )
                    )
            }
    )
    ResponseEntity<?> updateNotice(@PathVariable Long noticeId,
                                  @RequestBody NoticeUpdateRequestDto noticeUpdateRequestDto,
                                  Principal principal);

    @Operation(
            summary = "공지글 삭제",
            description = "공지글을 삭제합니다. 액세스 토큰이 필요합니다."
    )
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "공지글 삭제 성공."
                    ),
                    @ApiResponse(
                            responseCode = "401",
                            description = "공지글을 삭제할 자격이 없습니다.",
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
                    ),
                    @ApiResponse(
                            responseCode = "404",
                            description = "없는 공지글 id 입니다.",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(
                                            type = "object",
                                            example = "{\n" +
                                                    "  \"status\": \"404\",\n" +
                                                    "  \"errorMessage\": \"ERR_NOTICE_NOT_FOUND\"\n" +
                                                    "}"
                                    )
                            )
                    )
            }
    )
    public ResponseEntity<?> deleteNotice(@PathVariable Long noticeId, Principal principal);


    @Operation(
            summary = "공지글 리스트 반환",
            description = "공지글 리스트 반환합니다. 페이지 수가 필요합니다."
    )
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "공지글 리스트 반환 성공",
                            content = @Content(
                                    mediaType = "application/json",
                                    array = @ArraySchema(schema = @Schema(implementation = NoticeResponseDto.class))
                            )
                    )
            }
    )
    ResponseEntity<List<NoticeResponseDto>> getNotices(@PathVariable int pageNum);

    @Operation(
            summary = "공지글 페이지 수 반환",
            description = "공지글 페이지 수를 반환합니다."
    )
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "공지글 페이지 수 반환 성공",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = PageCountResponseDto.class)
                            )
                    )
            }
    )
    public ResponseEntity<?> getPageCount();

    @Operation(
            summary = "ADMIN 자격 확인",
            description = "ADMIN 인지 판단을 합니다. 액세스 토큰이 필요합니다."
    )
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "ADMIN 계정이 맞습니다."
                    ),
                    @ApiResponse(
                            responseCode = "401",
                            description = "ADMIN 계정이 아닙니다.",
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
    ResponseEntity<?> verify(Principal principal);
}
