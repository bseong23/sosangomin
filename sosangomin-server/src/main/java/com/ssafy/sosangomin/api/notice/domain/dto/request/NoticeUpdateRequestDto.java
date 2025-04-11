package com.ssafy.sosangomin.api.notice.domain.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;

public record NoticeUpdateRequestDto(
        @Schema(description = "수정할 공지사항 제목")
        String title,
        @Schema(description = "수정할 공지사항 내용")
        String content
) {
}
