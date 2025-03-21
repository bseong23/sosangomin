package com.ssafy.sosangomin.common.handler;

import com.ssafy.sosangomin.api.user.domain.entity.UserRole;
import com.ssafy.sosangomin.common.util.JwtTokenUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Slf4j
@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtTokenUtil jwtTokenUtil;

    @Value("${frontend-url}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication) throws IOException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        // 사용자 정보
        String id = oAuth2User.getName();
        String name = (String) oAuth2User.getAttributes().get("name");
        String profileImgUrl;
        if (oAuth2User.getAttributes().get("profileImgUrl") == null) { // null일때 대비
            profileImgUrl = "null";
        } else {
            profileImgUrl = (String) oAuth2User.getAttributes().get("profileImgUrl");
        }
        String isFirstLogin = (String) oAuth2User.getAttributes().get("isFirstLogin");
        String userId = (String) oAuth2User.getAttributes().get("userId");
        String userRole = oAuth2User.getAttributes().get("userRole").toString();

        String accessToken = jwtTokenUtil.createWeekAccessToken(id);

        // 리다이렉트 URL 생성
        String redirectUrl = frontendUrl + "/auth/kakao/callback"
                + "?accessToken=" + URLEncoder.encode(accessToken, StandardCharsets.UTF_8)
                + "&userName=" + URLEncoder.encode(name, StandardCharsets.UTF_8)
                + "&userProfileUrl=" + URLEncoder.encode(profileImgUrl, StandardCharsets.UTF_8)
                + "&isFirstLogin=" + URLEncoder.encode(isFirstLogin, StandardCharsets.UTF_8)
                + "&userId=" + URLEncoder.encode(userId, StandardCharsets.UTF_8)
                + "&userRole=" + URLEncoder.encode(userRole, StandardCharsets.UTF_8);

        System.out.println(redirectUrl);

        // 리다이렉트 수행
        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }
}
