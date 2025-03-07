package com.ssafy.sosangomin.api.user.mapper;

import com.ssafy.sosangomin.api.user.domain.entity.User;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.Optional;

@Mapper
public interface UserMapper {

    @Select("SELECT * FROM users WHERE id = #{id}")
    Optional<User> findUserById(@Param("id") Long id);

    @Select("SELECT * FROM users WHERE social_id = #{socialId}")
    Optional<User> findUserBySocialId(@Param("socialId") String socialId);

    @Insert("INSERT INTO users (social_id, name, profile_img_url) " +
             "VALUES (#{socialId}, #{name}, #{profileImgUrl})")
    void insertKakaoUser(
            @Param("socialId") String socialId,
            @Param("name") String name,
            @Param("profileImgUrl") String profileImgUrl
    );
}
