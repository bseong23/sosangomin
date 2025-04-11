package com.ssafy.sosangomin.api.notice.domain.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

public record NoticeInsertResponseDto(
        @Schema(description = "삽입한 notice의 id(pk)")
        Long insertedNoticeId
) {
}
