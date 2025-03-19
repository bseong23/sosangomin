package com.ssafy.sosangomin.api.board.mapper;

import com.ssafy.sosangomin.api.board.domain.dto.response.CommentResponseDto;
import com.ssafy.sosangomin.api.board.domain.dto.response.CommentResponseTempDto;
import com.ssafy.sosangomin.api.board.domain.entity.Comment;
import org.apache.ibatis.annotations.*;

import javax.swing.text.html.Option;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Mapper
public interface CommentMapper {

    @Results({
            @Result(property = "commentId", column = "comment_id"),
            @Result(property = "boardId", column = "board_id"),
            @Result(property = "commenterId", column = "commenter_id")
    })
    @Select("SELECT * FROM comments WHERE comment_id = #{commentId}")
    Optional<Comment> findByCommentId(@Param("commentId") Long commentId);

    @Select(
            "SELECT c.comment_id, c.commenter_id, u.name, c.content, " +
            "DATE_ADD(c.created_at, INTERVAL 9 HOUR) AS created_at " + // 9시간 더하기
            "FROM comments c " +
            "JOIN users u ON c.commenter_id = u.user_id " +
            "WHERE c.board_id = #{boardId} " + // 특정 게시글의 댓글만 필터링
            "ORDER BY c.comment_id DESC"
    )
    @ConstructorArgs({ // 반환타입을 record dto로 받기 위해서 이렇게 사용
            @Arg(column = "comment_id", javaType = Long.class),
            @Arg(column = "commenter_id", javaType = Long.class),
            @Arg(column = "name", javaType = String.class),
            @Arg(column = "content", javaType = String.class),
            @Arg(column = "created_at", javaType = LocalDateTime.class)
    })
    List<CommentResponseTempDto> findCommentResponseDtoByBoardId(@Param("boardId") Long boardId);

    @Insert("INSERT INTO comments (board_id, commenter_id, content) " +
            "VALUES (#{boardId}, #{userId}, #{content})")
    void insertComment(@Param("boardId") Long boardId,
                       @Param("userId") Long userId,
                       @Param("content") String content);

    @Update("UPDATE comments SET content = #{content} WHERE comment_id = #{commentId}")
    void updateComment(@Param("content") String content, @Param("commentId") Long commentId);

    @Delete("DELETE FROM comments WHERE comment_id = #{commentId}")
    void deleteComment(@Param("commentId") Long commentId);
}
