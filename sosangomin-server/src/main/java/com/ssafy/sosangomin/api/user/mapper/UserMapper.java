package com.ssafy.sosangomin.api.user.mapper;

import com.ssafy.sosangomin.api.user.domain.entity.User;
import com.ssafy.sosangomin.api.user.domain.entity.UserRole;
import com.ssafy.sosangomin.api.user.domain.entity.UserType;
import org.apache.ibatis.annotations.*;

import java.util.Optional;

@Mapper
public interface UserMapper {

    @Results({
            @Result(property = "userId", column = "user_id"),
            @Result(property = "socialId", column = "social_id"),
            @Result(property = "profileImgUrl", column = "profile_img_url"),
            @Result(property = "userType", column = "user_type",
                    typeHandler = org.apache.ibatis.type.EnumTypeHandler.class,
                    javaType = UserType.class), // for Enum Type
            @Result(property = "userRole", column = "user_role",
                    typeHandler = org.apache.ibatis.type.EnumTypeHandler.class,
                    javaType = UserRole.class) // for Enum Type
    })
    @Select("SELECT * FROM users WHERE user_id = #{userId}")
    Optional<User> findUserById(@Param("userId") Long userId);

    @Results({
            @Result(property = "userId", column = "user_id"),
            @Result(property = "socialId", column = "social_id"),
            @Result(property = "profileImgUrl", column = "profile_img_url"),
            @Result(property = "userType", column = "user_type",
                    typeHandler = org.apache.ibatis.type.EnumTypeHandler.class,
                    javaType = UserType.class), // for Enum Type
            @Result(property = "userRole", column = "user_role",
                    typeHandler = org.apache.ibatis.type.EnumTypeHandler.class,
                    javaType = UserRole.class) // for Enum Type
    })
    @Select("SELECT * FROM users WHERE name = #{name}")
    Optional<User> findUserByName(@Param("name") String name);

    @Results({
            @Result(property = "userId", column = "user_id"),
            @Result(property = "socialId", column = "social_id"),
            @Result(property = "profileImgUrl", column = "profile_img_url"),
            @Result(property = "userType", column = "user_type",
                    typeHandler = org.apache.ibatis.type.EnumTypeHandler.class,
                    javaType = UserType.class), // for Enum Type
            @Result(property = "userRole", column = "user_role",
                    typeHandler = org.apache.ibatis.type.EnumTypeHandler.class,
                    javaType = UserRole.class) // for Enum Type
    })
    @Select("SELECT * FROM users WHERE social_id = #{socialId}")
    Optional<User> findUserBySocialId(@Param("socialId") String socialId);

    @Results({
            @Result(property = "userId", column = "user_id"),
            @Result(property = "socialId", column = "social_id"),
            @Result(property = "profileImgUrl", column = "profile_img_url"),
            @Result(property = "userType", column = "user_type",
                    typeHandler = org.apache.ibatis.type.EnumTypeHandler.class,
                    javaType = UserType.class), // for Enum Type
            @Result(property = "userRole", column = "user_role",
                    typeHandler = org.apache.ibatis.type.EnumTypeHandler.class,
                    javaType = UserRole.class) // for Enum Type
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

    @Delete("DELETE FROM users WHERE user_id = #{userId}")
    void deleteUser(@Param("userId") Long userId);

    @Update("UPDATE users SET name = #{name} WHERE user_id = #{userId}")
    void updateName(
            @Param("name") String name,
            @Param("userId") Long userId
    );

    @Update("UPDATE users SET password = #{password} WHERE user_id = #{userId}")
    void updatePassword(
            @Param("password") String password,
            @Param("userId") Long userId
    );

    @Update("UPDATE users SET profile_img_url = #{profileImgUrl} WHERE user_id = #{userId}")
    void updateProfileImgUrl(
            @Param("profileImgUrl") String profileImgUrl,
            @Param("userId") Long userId
    );
}
