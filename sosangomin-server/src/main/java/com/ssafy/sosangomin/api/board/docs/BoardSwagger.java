package com.ssafy.sosangomin.api.board.docs;

import com.ssafy.sosangomin.api.board.domain.dto.response.BoardResponseDto;
import com.ssafy.sosangomin.api.news.domain.dto.response.NewsResponseDto;
import com.ssafy.sosangomin.api.news.domain.dto.response.PageCountResponseDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

public interface BoardSwagger {

    @Operation(
            summary = "단일 게시글 반환",
            description = "단일 게시글을 반환합니다. 게시글 id가 필요합니다. 조회수가 증가합니다."
    )
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "단일 게시글 반환 성공",
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
    ResponseEntity<BoardResponseDto> getBoard(@PathVariable Long boardId);

    @Operation(
            summary = "게시판 게시글 리스트 반환",
            description = "게시판 게시글 리스트 반환합니다. 페이지 수가 필요합니다."
    )
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "게시판 게시글 리스트 반환 성공",
                            content = @Content(
                                    mediaType = "application/json",
                                    array = @ArraySchema(schema = @Schema(implementation = BoardResponseDto.class))
                            )
                    )
            }
    )
    ResponseEntity<List<BoardResponseDto>> getBoards(@PathVariable int pageNum);

    @Operation(
            summary = "게시판 게시글 페이지 수 반환",
            description = "게시판 게시글 페이지 수를 반환합니다."
    )
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "게시판 게시글 페이지 수 반환 성공",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = PageCountResponseDto.class)
                            )
                    )
            }
    )
    public ResponseEntity<PageCountResponseDto> getPageCount();
}
