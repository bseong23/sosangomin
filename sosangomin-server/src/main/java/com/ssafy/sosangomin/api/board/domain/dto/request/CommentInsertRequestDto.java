package com.ssafy.sosangomin.api.board.domain.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;

public record CommentInsertRequestDto(
        @Schema(description = "작성할 댓글 내용")
        String content
) {
}
