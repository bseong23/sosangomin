package com.ssafy.sosangomin.api.board.mapper;

import com.ssafy.sosangomin.api.board.domain.dto.response.BoardResponseDto;
import org.apache.ibatis.annotations.*;

import java.util.List;
import java.util.Optional;

@Mapper
public interface BoardMapper {

    @Insert("INSERT INTO boards (user_id, title, content, views) " +
            "VALUES (#{userId}, #{title}, #{content}, 0)")
    void insertBoard(@Param("userId") Long userId,
                     @Param("title") String title,
                     @Param("content") String content);

    @Select(
            "SELECT b.*, n.name " +
            "FROM boards b " +
            "JOIN users n ON b.user_id = n.user_id " +
            "WHERE b.board_id = #{boardId}"
    )
    @ConstructorArgs({ // 반환타입을 record dto로 받기 위해서 이렇게 사용
            @Arg(column = "board_id", javaType = Long.class),
            @Arg(column = "name", javaType = String.class),
            @Arg(column = "title", javaType = String.class),
            @Arg(column = "content", javaType = String.class),
            @Arg(column = "views", javaType = Long.class)
    })
    Optional<BoardResponseDto> findBoardById(@Param("boardId") Long boardId);

    @Update("UPDATE boards SET views = views + 1 WHERE board_id = #{boardId}")
    void incrementBoardViews(@Param("boardId") Long boardId);

    @Select(
            "SELECT b.*, n.name " +
            "FROM boards b " +
            "JOIN users n ON b.user_id = n.user_id " +
            "ORDER BY b.board_id DESC " +
            "LIMIT 10 " +
            "OFFSET ${offset}"
    )
    @ConstructorArgs({ // 반환타입을 record dto로 받기 위해서 이렇게 사용
            @Arg(column = "board_id", javaType = Long.class),
            @Arg(column = "name", javaType = String.class),
            @Arg(column = "title", javaType = String.class),
            @Arg(column = "content", javaType = String.class),
            @Arg(column = "views", javaType = Long.class)
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
