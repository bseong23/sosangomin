package com.ssafy.sosangomin.api.notice.domain.entity;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Notice {

    private Long noticeId;
    private Long userId;
    private String title;
    private String content;
    private Long views;

    @Builder
    public Notice(Long noticeId,
                  Long userId,
                  String title,
                  String content,
                  Long views) {
        this.noticeId = noticeId;
        this.userId = userId;
        this.title = title;
        this.content = content;
        this.views = views;
    }
}
