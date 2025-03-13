package com.ssafy.sosangomin.api.news.domain.dto.response;

import com.ssafy.sosangomin.api.news.domain.entity.News;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;

import java.util.Date;

@Builder
public record NewsResponseDto(
        @Schema(description = "뉴스 제목")
        String title,
        @Schema(description = "원본 뉴스 url")
        String link,
        @Schema(description = "원본 뉴스 게재일")
        Date pubDate,
        @Schema(description = "원본 뉴스 썸네일 이미지 url")
        String imageUrl,
        @Schema(description = "원본 뉴스 좋아요 수")
        String category,
        int likesCount,
        @Schema(description = "원본 뉴스 댓글 수")
        int commentsCount
) {
    public static NewsResponseDto of(News news) {
        return NewsResponseDto.builder()
                .title(news.getTitle())
                .link(news.getLink())
                .pubDate(news.getPubDate())
                .imageUrl(news.getImageUrl())
                .category(news.getCategory())
                .likesCount(news.getLikesCount())
                .commentsCount(news.getCommentsCount())
                .build();
    }
}
