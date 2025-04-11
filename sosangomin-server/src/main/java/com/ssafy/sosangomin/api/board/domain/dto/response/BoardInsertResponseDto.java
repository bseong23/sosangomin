package com.ssafy.sosangomin.api.board.domain.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

public record BoardInsertResponseDto(
        @Schema(description = "삽입한 board의 id(pk)")
        Long insertedBoardId
) {
}
