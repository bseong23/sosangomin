package com.ssafy.sosangomin.api.user.service;

import java.util.*;

import com.ssafy.sosangomin.api.user.domain.entity.User;
import com.ssafy.sosangomin.api.user.mapper.UserMapper;
import com.ssafy.sosangomin.common.util.IdEncryptionUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

/**
 * 추후 to-do
 * - 소셜 로그인 시, UserRole이나 UserType를 추후에 선택해야하기 때문에 그 부분 추후 추가
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class KakaoOAuth2UserService extends DefaultOAuth2UserService {

    private final UserMapper userMapper;
    private final IdEncryptionUtil idEncryptionUtil;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {

        OAuth2User oAuth2User = super.loadUser(userRequest);
        String socialId = oAuth2User.getAttribute("id").toString();

        // 닉네임은 중복가능성이 있기 때문에 socialId로 기존 회원 판단했음
        Optional<User> existingUser = userMapper.findUserBySocialId(socialId);

        if (existingUser.isPresent()) { // 기존 회원인 경우
            User user = existingUser.get();

            // 사용자 권한 설정 (특별한 권한 없을때 설정하는 기본 권한)
            Collection<GrantedAuthority> authorities = Collections.singletonList(
                    new SimpleGrantedAuthority("ROLE_USER"));

            String encryptedUserId = idEncryptionUtil.encrypt(user.getUserId());

            // 유저 소유 store id (암호화)
            List<Long> rawStoreIdList = userMapper.findStoreIdByUserId(user.getUserId());
            List<String> encryptedStoreIdList = new ArrayList<>();
            for (Long rawStoreId : rawStoreIdList) {
                encryptedStoreIdList.add(idEncryptionUtil.encrypt(rawStoreId));
            }

            // 사용자 속성 설정
            Map<String, Object> attributes = new HashMap<>();
            // 아래에서 주요 식별자로 "id"를 사용할 것이기 때문에 넣어줌
            attributes.put("id", user.getUserId());
            attributes.put("name", user.getName());
            attributes.put("profileImgUrl", user.getProfileImgUrl());
            attributes.put("isFirstLogin", "false");
            attributes.put("userId", encryptedUserId);
            attributes.put("userRole", user.getUserRole());
            attributes.put("storeIdList", encryptedStoreIdList);

            // OAuth2User 객체 생성 및 반환
            return new DefaultOAuth2User(authorities, attributes, "id");

        } else { // 신규 회원인 경우

            Map<String, Object> kakaoAccount = (Map<String, Object>) oAuth2User.getAttributes().get("kakao_account");
            Map<String, Object> profile = (Map<String, Object>) kakaoAccount.get("profile");

            String name = (String) profile.get("nickname");
            String profileImgUrl = (String) profile.get("profile_image_url");

            userMapper.signUpKakaoUser(socialId, name, profileImgUrl);

            // 사용자 권한 설정 (특별한 권한 없을때 설정하는 기본 권한)
            Collection<GrantedAuthority> authorities = Collections.singletonList(
                    new SimpleGrantedAuthority("ROLE_USER"));

            Optional<User> savedUser = userMapper.findUserBySocialId(socialId);
            String encryptedUserId = idEncryptionUtil.encrypt(savedUser.get().getUserId());

            // 사용자 속성 설정
            Map<String, Object> attributes = new HashMap<>();

            // 아래에서 주요 식별자로 "id"를 사용할 것이기 때문에 넣어줌
            attributes.put("id", savedUser.get().getUserId());
            attributes.put("name", name);
            attributes.put("profileImgUrl", profileImgUrl);
            attributes.put("isFirstLogin", "true");
            attributes.put("userId", encryptedUserId);

            // OAuth2User 객체 생성 및 반환
            return new DefaultOAuth2User(authorities, attributes, "id");
        }
    }
}
