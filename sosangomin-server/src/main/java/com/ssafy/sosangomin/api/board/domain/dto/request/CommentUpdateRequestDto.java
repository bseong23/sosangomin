package com.ssafy.sosangomin.api.board.domain.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;

public record CommentUpdateRequestDto(
        @Schema(description = "수정할 댓글 내용")
        String content
) {
}
