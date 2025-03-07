package com.ssafy.sosangomin.api.user.mapper;

import com.ssafy.sosangomin.api.user.entity.User;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.Optional;

@Mapper
public interface UserMapper {

    @Select("SELECT * FROM users WHERE id = #{id}")
    Optional<User> findUserById(@Param("id") Long id);

    @Select("SELECT * FROM users WHERE socail_id = #{socailId}")
    Optional<User> findUserBySocialId(@Param("socialId") String socialId);

    @Insert("INSERT INTO users (social_id, name, profile_img_url) " +
             "VALUES (#{socailId}, #{name}, #{profileImgUrl})")
    void insertKakaoUser(
            @Param("socailId") String socialId,
            @Param("name") String name,
            @Param("profileImgUrl") String profileImgUrl
    );
}
