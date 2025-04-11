package com.ssafy.sosangomin.api.notice.domain.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

public record NoticeResponseDto(
        @Schema(description = "공지사항 넘버")
        Long noticeId,
        @Schema(description = "공지사항 작성자 닉네임")
        String name,
        @Schema(description = "공지사항 제목")
        String title,
        @Schema(description = "공지사항 내용")
        String content,
        @Schema(description = "조회수")
        Long views,
        @Schema(description = "생성 날짜, 시간")
        LocalDateTime createdAt
) {
        public NoticeResponseDto incrementViews() {
            return new NoticeResponseDto(
                    this.noticeId,
                    this.name,
                    this.title,
                    this.content,
                    this.views,
                    this.createdAt);
        }
}
