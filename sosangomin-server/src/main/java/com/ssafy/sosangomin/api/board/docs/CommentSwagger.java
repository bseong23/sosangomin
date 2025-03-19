package com.ssafy.sosangomin.api.board.docs;

import com.ssafy.sosangomin.api.board.domain.dto.request.CommentInsertRequestDto;
import com.ssafy.sosangomin.api.board.domain.dto.response.BoardResponseDto;
import com.ssafy.sosangomin.api.board.domain.dto.response.CommentResponseDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

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
                                    schema = @Schema(implementation = BoardResponseDto.class)
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
    public ResponseEntity<List<CommentResponseDto>> getComment(@PathVariable Long boardId);

    @Operation(
            summary = "게시물에 댓글 작성",
            description = "해당 게시물의 댓글을 작성합니다."
    )
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "댓글 작성 성공",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = BoardResponseDto.class)
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
    public ResponseEntity<?> insertComment(@PathVariable Long boardId,
                                           @RequestBody CommentInsertRequestDto commentInsertRequestDto,
                                           Principal principal);
}
