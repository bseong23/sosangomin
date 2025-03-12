package com.ssafy.sosangomin.api.user.mapper;

import com.ssafy.sosangomin.api.user.domain.entity.User;
import org.apache.ibatis.annotations.*;

import java.util.Optional;

@Mapper
public interface UserMapper {

    @Results({
            @Result(property = "socialId", column = "social_id"),
            @Result(property = "profileImgUrl", column = "profile_img_url")
    })
    @Select("SELECT * FROM users WHERE id = #{id}")
    Optional<User> findUserById(@Param("id") Long id);

    @Results({
            @Result(property = "socialId", column = "social_id"),
            @Result(property = "profileImgUrl", column = "profile_img_url")
    })
    @Select("SELECT * FROM users WHERE name = #{name}")
    Optional<User> findUserByName(@Param("name") String name);

    @Results({
            @Result(property = "socialId", column = "social_id"),
            @Result(property = "profileImgUrl", column = "profile_img_url")
    })
    @Select("SELECT * FROM users WHERE social_id = #{socialId}")
    Optional<User> findUserBySocialId(@Param("socialId") String socialId);

    @Results({
            @Result(property = "socialId", column = "social_id"),
            @Result(property = "profileImgUrl", column = "profile_img_url")
    })
    @Select("SELECT * FROM users WHERE email = #{email}")
    Optional<User> findUserByEmail(@Param("email") String email);

    @Insert("INSERT INTO users (social_id, user_type, name, profile_img_url, user_role) " +
             "VALUES (#{socialId}, 'KAKAO', #{name}, #{profileImgUrl}, 'USER')")
    void signUpKakaoUser(
            @Param("socialId") String socialId,
            @Param("name") String name,
            @Param("profileImgUrl") String profileImgUrl
    );

    @Insert("INSERT INTO users (user_type, email, name, password, user_role) " +
            "VALUES ('NORMAL', #{email}, #{name}, #{password}, 'USER')")
    void signUpUser(
            @Param("email") String email,
            @Param("name") String name,
            @Param("password") String password
    );

    @Update("UPDATE users SET name = #{name} WHERE id = #{id}")
    void updateName(
            @Param("name") String name,
            @Param("id") Long id
    );

    @Update("UPDATE users SET password = #{password} WHERE id = #{id}")
    void updatePassword(
            @Param("password") String password,
            @Param("id") Long id
    );
}
