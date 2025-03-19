package com.ssafy.sosangomin.api.board.docs;

import com.ssafy.sosangomin.api.board.domain.dto.request.BoardInsertRequestDto;
import com.ssafy.sosangomin.api.board.domain.dto.response.BoardResponseDto;
import com.ssafy.sosangomin.api.board.domain.dto.request.BoardUpdateRequestDto;
import com.ssafy.sosangomin.api.news.domain.dto.response.PageCountResponseDto;
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

public interface BoardSwagger {

    @Operation(
            summary = "게시글 등록",
            description = "게시글을 등록합니다. 게시물 제목, 게시물 본문이 필요합니다 .액세스 토큰이 필요합니다."
    )
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "게시글 등록 성공"
                    )
            }
    )
    ResponseEntity<?> insertBoard(
            @RequestBody BoardInsertRequestDto boardInsertRequestDto,
            Principal principal
    );

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
            summary = "게시글 수정",
            description = "게시글을 수정합니다. 수정할 제목과 내용이 필요합니다. 액세스 토큰이 필요합니다."
    )
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "게시물 수정 성공.",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = BoardResponseDto.class)
                            )
                    ),
                    @ApiResponse(
                            responseCode = "401",
                            description = "게시물을 수정할 자격이 없습니다.",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(
                                            type = "object",
                                            example = "{\n" +
                                                    "  \"status\": \"401\",\n" +
                                                    "  \"errorMessage\": \"ERR_USER_BOARD_NOT_MATCH\"\n" +
                                                    "}"
                                    )
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
    ResponseEntity<?> updateBoard(@PathVariable Long boardId,
                                  @RequestBody BoardUpdateRequestDto boardUpdateRequestDto,
                                  Principal principal);

    @Operation(
            summary = "게시글 삭제",
            description = "게시글을 삭제합니다. 액세스 토큰이 필요합니다."
    )
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "게시물 삭제 성공.",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = BoardResponseDto.class)
                            )
                    ),
                    @ApiResponse(
                            responseCode = "401",
                            description = "게시물을 삭제할 자격이 없습니다.",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(
                                            type = "object",
                                            example = "{\n" +
                                                    "  \"status\": \"401\",\n" +
                                                    "  \"errorMessage\": \"ERR_USER_BOARD_NOT_MATCH\"\n" +
                                                    "}"
                                    )
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
    public ResponseEntity<?> deleteBoard(@PathVariable Long boardId, Principal principal);

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

    @Operation(
            summary = "게시글 자격 확인",
            description = "해당 게시글이 유저가 쓴 게시글글인지 자격 판단을 합니다. 게시글 id가 필요합니다. 액세스 토큰이 필요합니다."
    )
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "해당 유저의 게시글이 맞습니다.",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = BoardResponseDto.class)
                            )
                    ),
                    @ApiResponse(
                            responseCode = "401",
                            description = "해당 유저의 게시글이 아닙니다.",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(
                                            type = "object",
                                            example = "{\n" +
                                                    "  \"status\": \"401\",\n" +
                                                    "  \"errorMessage\": \"ERR_USER_BOARD_NOT_MATCH\"\n" +
                                                    "}"
                                    )
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
    ResponseEntity<Boolean> verify(@PathVariable Long boardId, Principal principal);
}
