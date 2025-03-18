package com.ssafy.sosangomin.api.board.domain.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

public record BoardResponseDto(
        @Schema(description = "게시글 넘버")
        Long boardId,
        @Schema(description = "게시글 작성자 닉네임")
        String name,
        @Schema(description = "게시글 제목")
        String title,
        @Schema(description = "게시글 내용")
        String content,
        @Schema(description = "조회수")
        Long views,
        @Schema(description = "생성 날짜, 시간")
        LocalDateTime createdAt
) {
        public BoardResponseDto incrementViews() {
                return new BoardResponseDto(
                        this.boardId,
                        this.name,
                        this.title,
                        this.content,
                        this.views + 1,
                        this.createdAt
                );
        }
}
