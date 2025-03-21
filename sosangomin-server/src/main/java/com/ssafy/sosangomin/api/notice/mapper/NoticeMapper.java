package com.ssafy.sosangomin.api.notice.mapper;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface NoticeMapper {

    @Insert("INSERT INTO notices (user_id, title, content, views) " +
            "VALUES (#{userId}, #{title}, #{content}, 0)")
    void insertNotice(@Param("userId") Long userId,
                     @Param("title") String title,
                     @Param("content") String content);

    @Select("SELECT last_insert_id()")
    Long lastInsertId();
}
