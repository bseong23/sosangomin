package com.ssafy.sosangomin.api.news.domain.entity;

import com.ssafy.sosangomin.common.entity.BaseTimeEntity;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Date;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class News extends BaseTimeEntity {

    private String title;
    private String link;
    private Date pubDate;
    private String imageUrl;
    private String category;
    private int likesCount;
    private int commentsCount;

    @Builder
    public News(
            String title,
            String link,
            Date pubDate,
            String imageUrl,
            String category,
            int likesCount,
            int commentsCount
    ) {
        this.title = title;
        this.link = link;
        this.pubDate = pubDate;
        this.imageUrl = imageUrl;
        this.category = category;
        this.likesCount = likesCount;
        this.commentsCount = commentsCount;
    }
}
