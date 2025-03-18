package com.ssafy.sosangomin.api.board.domain.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;

public record BoardInsertRequestDto(
        @Schema(description = "게시물 제목")
        String title,
        @Schema(description = "게시물 내용")
        String content
) {
}
