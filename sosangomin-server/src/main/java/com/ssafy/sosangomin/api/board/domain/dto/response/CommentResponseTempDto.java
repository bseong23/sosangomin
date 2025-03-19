package com.ssafy.sosangomin.api.board.domain.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

public record CommentResponseDto(
        @Schema(description = "댓글 넘버")
        Long commentId,
        @Schema(description = "댓글 작성자 닉네임")
        String name,
        @Schema(description = "댓글 내용")
        String content,
        @Schema(description = "생성 날짜, 시간")
        LocalDateTime createdAt
) {
}
