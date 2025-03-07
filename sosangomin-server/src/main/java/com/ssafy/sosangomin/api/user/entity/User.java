package com.ssafy.sosangomin.api.user.entity;

import com.ssafy.sosangomin.common.entity.BaseTimeEntity;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User extends BaseTimeEntity implements OAuth2User, UserDetails {

    private Long id;
    private String socialId;
    private UserType userType;
    private String email;
    private String password;
    private String name;
    private String profileImgUrl;
    private UserRole userRole;

    @Builder
    public User(
            Long id,
            String socialId,
            UserType userType,
            String email,
            String password,
            String name,
            String profileImgUrl,
            UserRole userRole) {
        this.id = id;
        this.socialId = socialId;
        this.userType = userType;
        this.email = email;
        this.password = password;
        this.name = name;
        this.profileImgUrl = profileImgUrl;
        this.userRole = userRole;
    }

    /**
     * UserDetails 오버라이드
     */

    @Override
    public Map<String, Object> getAttributes() {
        Map<String, Object> attributes = new HashMap<>();
        attributes.put("name", name);
        attributes.put("profileImgUrl", profileImgUrl);
        return attributes;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"));
    }

    @Override
    public String getUsername() {
        return this.id.toString();
    }

    @Override
    public String getPassword() {
        return null;
    } // OAuth2는 비밀번호 없음, 근데 일반로그인 때문에, 추후에 만들어야할듯

}
