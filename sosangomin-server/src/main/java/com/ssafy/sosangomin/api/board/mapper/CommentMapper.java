package com.ssafy.sosangomin.api.board.mapper;

import com.ssafy.sosangomin.api.board.domain.dto.response.CommentResponseDto;
import com.ssafy.sosangomin.api.board.domain.entity.Comment;
import org.apache.ibatis.annotations.*;

import java.time.LocalDateTime;
import java.util.List;

@Mapper
public interface CommentMapper {

    @Select(
            "SELECT c.comment_id, u.name, c.content, " +
                    "DATE_ADD(c.created_at, INTERVAL 9 HOUR) AS created_at " + // 9시간 더하기
                    "FROM comments c " +
                    "JOIN users u ON c.commenter_id = u.user_id " +
                    "WHERE c.board_id = #{boardId} " + // 특정 게시글의 댓글만 필터링
                    "ORDER BY c.comment_id DESC"
    )
    @ConstructorArgs({ // 반환타입을 record dto로 받기 위해서 이렇게 사용
            @Arg(column = "comment_id", javaType = Long.class),
            @Arg(column = "name", javaType = String.class),
            @Arg(column = "content", javaType = String.class),
            @Arg(column = "created_at", javaType = LocalDateTime.class)
    })
    List<CommentResponseDto> findCommentResponseDtoByBoardId(@Param("boardId") Long boardId);
}
