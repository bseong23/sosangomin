package com.ssafy.sosangomin.api.notice.mapper;

import com.ssafy.sosangomin.api.notice.domain.dto.response.NoticeResponseDto;
import com.ssafy.sosangomin.api.notice.domain.entity.Notice;
import org.apache.ibatis.annotations.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Mapper
public interface NoticeMapper {

    @Insert("INSERT INTO notices (user_id, title, content, views) " +
            "VALUES (#{userId}, #{title}, #{content}, 0)")
    void insertNotice(@Param("userId") Long userId,
                     @Param("title") String title,
                     @Param("content") String content);

    @Select("SELECT last_insert_id()")
    Long lastInsertId();

    @Update("UPDATE notices SET title = #{title}, content = #{content} WHERE notice_id = #{noticeId}")
    void updateNotice(@Param("noticeId") Long noticeId,
                     @Param("title") String title,
                     @Param("content") String content);

    @Delete("DELETE FROM notices WHERE notice_id = #{noticeId}")
    void deleteNotice(@Param("noticeId") Long noticeId);

    @Results({
            @Result(property = "noticeId", column = "notice_id"),
            @Result(property = "userId", column = "user_id"),
    })
    @Select("SELECT * FROM notices WHERE notice_id = #{noticeId}")
    Optional<Notice> findNoticeById(@Param("noticeId") Long noticeId);

    @Select(
            "SELECT b.*, n.name, " +
            "DATE_ADD(b.created_at, INTERVAL 9 HOUR) AS created_at " + // 9시간 더하기
            "FROM notices b " +
            "JOIN users n ON b.user_id = n.user_id " +
            "WHERE b.notice_id = #{noticeId}"
    )
    @ConstructorArgs({ // 반환타입을 record dto로 받기 위해서 이렇게 사용
            @Arg(column = "notice_id", javaType = Long.class),
            @Arg(column = "name", javaType = String.class),
            @Arg(column = "title", javaType = String.class),
            @Arg(column = "content", javaType = String.class),
            @Arg(column = "views", javaType = Long.class),
            @Arg(column = "created_at", javaType = LocalDateTime.class)
    })
    Optional<NoticeResponseDto> findNoticeResponseDtoById(@Param("noticeId") Long noticeId);

    @Update("UPDATE notices SET views = views + 1 WHERE notice_id = #{noticeId}")
    void incrementNoticeViews(@Param("noticeId") Long noticeId);

    @Select(
            "SELECT b.notice_id, n.name, b.title, b.content, b.views, " +
                    "DATE_ADD(b.created_at, INTERVAL 9 HOUR) AS created_at " + // 9시간 더하기
                    "FROM notices b " +
                    "JOIN users n ON b.user_id = n.user_id " +
                    "ORDER BY b.notice_id DESC " +
                    "LIMIT 10 " +
                    "OFFSET #{offset}"
    )
    @ConstructorArgs({ // 반환타입을 record dto로 받기 위해서 이렇게 사용
            @Arg(column = "notice_id", javaType = Long.class),
            @Arg(column = "name", javaType = String.class),
            @Arg(column = "title", javaType = String.class),
            @Arg(column = "content", javaType = String.class),
            @Arg(column = "views", javaType = Long.class),
            @Arg(column = "created_at", javaType = LocalDateTime.class)
    })
    List<NoticeResponseDto> findNoticesByPageNum(@Param("offset") int offset);

    @Select(
            "SELECT " +
            "CEIL(COUNT(*) / 10.0) " +
            "AS total_pages " +
            "FROM notices"
    )
    int getNoticesPageCount();
}
