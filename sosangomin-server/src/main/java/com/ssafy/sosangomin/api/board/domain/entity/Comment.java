package com.ssafy.sosangomin.api.board.domain.entity;

import com.ssafy.sosangomin.common.entity.BaseTimeEntity;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Comment extends BaseTimeEntity {

    private Long commentId;
    private Long boardId;
    private Long commenterId;
    private String content;

    @Builder
    public Comment(
            Long commentId,
            Long boardId,
            Long commenterId,
            String content) {
        this.commentId = commentId;
        this.boardId = boardId;
        this.commenterId = commenterId;
        this.content = content;
    }
}
