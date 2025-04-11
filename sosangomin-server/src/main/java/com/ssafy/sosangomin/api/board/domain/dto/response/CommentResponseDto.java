package com.ssafy.sosangomin.api.board.domain.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record CommentResponseDto(
        @Schema(description = "댓글 넘버")
        Long commentId,
        @Schema(description = "댓글 작성자 닉네임")
        String name,
        @Schema(description = "댓글 내용")
        String content,
        @Schema(description = "본인이 작성한 댓글 인지에 대한 여부")
        boolean isVerified,
        @Schema(description = "생성 날짜, 시간")
        LocalDateTime createdAt
) {
        public static CommentResponseDto of(CommentResponseTempDto commentResponseTempDto) {
                return CommentResponseDto.builder().
                        commentId(commentResponseTempDto.commentId()).
                        name(commentResponseTempDto.name()).
                        content(commentResponseTempDto.content()).
                        isVerified(false).
                        createdAt(commentResponseTempDto.createdAt())
                        .build();
        }

        public static CommentResponseDto checkVerifiedAndReturn(Long userId, CommentResponseTempDto commentResponseTempDto) {
                boolean verified = false;
                if (userId.equals(commentResponseTempDto.commenterId())) {
                        verified = true;
                }
                return new CommentResponseDto(
                        commentResponseTempDto.commentId(),
                        commentResponseTempDto.name(),
                        commentResponseTempDto.content(),
                        verified,
                        commentResponseTempDto.createdAt()
                );
        }
}
