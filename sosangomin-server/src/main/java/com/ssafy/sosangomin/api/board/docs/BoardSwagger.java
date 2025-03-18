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
            summary = "게시판 게시글 리스트 반환",
            description = "게시판 게시글 리스트 반환"
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
            description = "게시판 게시글 페이지 수 반환"
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
