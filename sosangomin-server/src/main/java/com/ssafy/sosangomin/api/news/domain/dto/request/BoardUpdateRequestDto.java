package com.ssafy.sosangomin.api.news.domain.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;

public record BoardUpdateRequestDto(
        @Schema(description = "수정하고자하는 글 제목")
        String title,
        @Schema(description = "수정하고자하는 글 내용")
        String content
) {
}
