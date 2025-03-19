package com.ssafy.sosangomin.api.board.docs;

import com.ssafy.sosangomin.api.board.domain.dto.request.CommentInsertRequestDto;
import com.ssafy.sosangomin.api.board.domain.dto.request.CommentUpdateRequestDto;
import com.ssafy.sosangomin.api.board.domain.dto.response.BoardResponseDto;
import com.ssafy.sosangomin.api.board.domain.dto.response.CommentResponseDto;
import com.ssafy.sosangomin.common.annotation.DecryptedId;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import java.security.Principal;
import java.util.List;

public interface CommentSwagger {

    @Operation(
            summary = "해당 게시물의 댓글 리스트 반환",
            description = "해당 게시물의 댓글 리스트 반환합니다."
    )
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "게시물의 댓글 리스트 반환 성공",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = CommentResponseDto.class)
                            )
                    ),
                    @ApiResponse(
                            responseCode = "404",
                            description = "없는 게시글 id 입니다.",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(
                                            type = "object",
                                            example = "{\n" +
                                                    "  \"status\": \"404\",\n" +
                                                    "  \"errorMessage\": \"ERR_BOARD_NOT_FOUND\"\n" +
                                                    "}"
                                    )
                            )
                    )
            }
    )
    public ResponseEntity<List<CommentResponseDto>> getComment(@PathVariable Long boardId,
                                                               @Parameter(name = "userId", description = "암호화된 사용자 id(pk) / 로그인 안되어있을 경우 안넣어도 됨", schema = @Schema(type = "string"), required = false)
                                                               @DecryptedId @RequestParam(required = false) Long userId);

    @Operation(
            summary = "게시물에 댓글 작성",
            description = "해당 게시물의 댓글을 작성합니다. 액세스 토큰이 필요합니다."
    )
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "댓글 작성 성공"
                    ),
                    @ApiResponse(
                            responseCode = "404",
                            description = "없는 게시글 id 입니다.",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(
                                            type = "object",
                                            example = "{\n" +
                                                    "  \"status\": \"404\",\n" +
                                                    "  \"errorMessage\": \"ERR_BOARD_NOT_FOUND\"\n" +
                                                    "}"
                                    )
                            )
                    )
            }
    )
    public ResponseEntity<?> insertComment(@PathVariable Long boardId,
                                           @RequestBody CommentInsertRequestDto commentInsertRequestDto,
                                           Principal principal);

    @Operation(
            summary = "댓글 수정",
            description = "댓글을 수정합니다. 수정할 내용이 필요합니다. 액세스 토큰이 필요합니다."
    )
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "댓글 수정 성공.",
                            content = @Content(
                                    mediaType = "application/json"
                            )
                    ),
                    @ApiResponse(
                            responseCode = "401",
                            description = "댓글을 수정할 자격이 없습니다.",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(
                                            type = "object",
                                            example = "{\n" +
                                                    "  \"status\": \"401\",\n" +
                                                    "  \"errorMessage\": \"ERR_USER_COMMENT_NOT_MATCH\"\n" +
                                                    "}"
                                    )
                            )
                    ),
                    @ApiResponse(
                            responseCode = "404",
                            description = "없는 댓글 id 입니다.",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(
                                            type = "object",
                                            example = "{\n" +
                                                    "  \"status\": \"404\",\n" +
                                                    "  \"errorMessage\": \"ERR_COMMENT_NOT_FOUND\"\n" +
                                                    "}"
                                    )
                            )
                    )
            }
    )
    public ResponseEntity<?> updateComment(@PathVariable Long commentId,
                                           @RequestBody CommentUpdateRequestDto commentUpdateRequestDto,
                                           Principal principal);
}
