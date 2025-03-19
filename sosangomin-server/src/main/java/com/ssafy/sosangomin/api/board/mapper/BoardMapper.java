package com.ssafy.sosangomin.api.board.mapper;

import com.ssafy.sosangomin.api.board.domain.dto.response.BoardResponseDto;
import com.ssafy.sosangomin.api.board.domain.entity.Board;
import org.apache.ibatis.annotations.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Mapper
public interface BoardMapper {

    @Insert("INSERT INTO boards (user_id, title, content, views) " +
            "VALUES (#{userId}, #{title}, #{content}, 0)")
    void insertBoard(@Param("userId") Long userId,
                     @Param("title") String title,
                     @Param("content") String content);

    @Update("UPDATE boards SET title = #{title}, content = #{content} WHERE board_id = #{boardId}")
    void updateBoard(@Param("boardId") Long boardId,
                     @Param("title") String title,
                     @Param("content") String content);

    @Results({
            @Result(property = "boardId", column = "board_id"),
            @Result(property = "userId", column = "user_id"),
    })
    @Select("SELECT * FROM boards WHERE board_id = #{boardId}")
    Optional<Board> findBoardById(@Param("boardId") Long boardId);

    @Select(
            "SELECT b.*, n.name, " +
            "DATE_ADD(b.created_at, INTERVAL 9 HOUR) AS created_at " + // 9시간 더하기
            "FROM boards b " +
            "JOIN users n ON b.user_id = n.user_id " +
            "WHERE b.board_id = #{boardId}"
    )
    @ConstructorArgs({ // 반환타입을 record dto로 받기 위해서 이렇게 사용
            @Arg(column = "board_id", javaType = Long.class),
            @Arg(column = "name", javaType = String.class),
            @Arg(column = "title", javaType = String.class),
            @Arg(column = "content", javaType = String.class),
            @Arg(column = "views", javaType = Long.class),
            @Arg(column = "created_at", javaType = LocalDateTime.class)
    })
    Optional<BoardResponseDto> findBoardResponseDtoById(@Param("boardId") Long boardId);

    @Update("UPDATE boards SET views = views + 1 WHERE board_id = #{boardId}")
    void incrementBoardViews(@Param("boardId") Long boardId);

    @Select(
            "SELECT b.board_id, n.name, b.title, b.content, b.views, " +
            "DATE_ADD(b.created_at, INTERVAL 9 HOUR) AS created_at " + // 9시간 더하기
            "FROM boards b " +
            "JOIN users n ON b.user_id = n.user_id " +
            "ORDER BY b.board_id DESC " +
            "LIMIT 10 " +
            "OFFSET #{offset}"
    )
    @ConstructorArgs({ // 반환타입을 record dto로 받기 위해서 이렇게 사용
            @Arg(column = "board_id", javaType = Long.class),
            @Arg(column = "name", javaType = String.class),
            @Arg(column = "title", javaType = String.class),
            @Arg(column = "content", javaType = String.class),
            @Arg(column = "views", javaType = Long.class),
            @Arg(column = "created_at", javaType = LocalDateTime.class)
    })
    List<BoardResponseDto> findBoardsByPageNum(@Param("offset") int offset);

    @Select(
            "SELECT " +
            "CEIL(COUNT(*) / 10.0) " +
            "AS total_pages " +
            "FROM boards"
    )
    int getBoardsPageCount();
}
