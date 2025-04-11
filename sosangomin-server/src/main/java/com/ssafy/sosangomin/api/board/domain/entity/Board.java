package com.ssafy.sosangomin.api.board.domain.entity;

import com.ssafy.sosangomin.common.entity.BaseTimeEntity;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Board extends BaseTimeEntity {

    private Long boardId;
    private Long userId;
    private String title;
    private String content;
    private Long views;

    @Builder
    public Board(
            Long boardId,
            Long userId,
            String title,
            String content,
            Long views) {
        this.boardId = boardId;
        this.userId = userId;
        this.title = title;
        this.content = content;
        this.views = views;
    }
}
