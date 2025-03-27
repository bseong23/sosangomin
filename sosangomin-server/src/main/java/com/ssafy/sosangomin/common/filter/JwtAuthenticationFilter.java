package com.ssafy.sosangomin.common.filter;

import com.ssafy.sosangomin.common.util.JwtTokenUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenUtil jwtTokenUtil;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String token = getJwtFromRequest(request);

        if (token != null) {
            String jwtToken = detachBearer(token);

            if (StringUtils.hasText(jwtToken) && jwtTokenUtil.validateToken(jwtToken)) {

                // 토큰에서 사용자 정보(id) 추출
                String id = jwtTokenUtil.getIdFromToken(jwtToken).toString();

                // UserDetails 객체 로드
                UserDetails userDetails = userDetailsService.loadUserByUsername(id);

                // Authentication 객체 생성
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

                // 현재 요청 정보 설정
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // SecurityContext에 Authentication 객체 저장
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }
        filterChain.doFilter(request, response);
    }

    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken;
        }
        return null; // 이렇게 해야 바로 오류가 안터지고 shouldNotFilter가 먹힘
    }

    /**
     * SecurityConfig에서 허용해줘도 스웨거를 들어갈 때, 여기서 예외가 터져서 이거 넣어둬야함
     */
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getRequestURI();
        String method = request.getMethod();

        // /api/user는 post인 회원가입만 필터 안거치게
        if (path.equals("/api/user") && !method.equals("POST")) {
            return false;
        }

        // 경로 매개변수가 있는 게시글 상세 URL 패턴 (예: /api/board/123)
        if (path.matches("/api/board/\\d+") && method.equals("GET")) {
            return true;
        }

        if (path.matches("/api/comment/\\d+") && method.equals("GET")) {
            return true;
        }

        if (path.matches("/api/notice/\\d+") && method.equals("GET")) {
            return true;
        }

        return path.startsWith("/swagger-ui/") ||
                path.startsWith("/v3/api-docs") ||
                path.startsWith("/swagger-resources") ||
                path.startsWith("/h2-console") ||
                path.startsWith("/api/mail") ||
                path.equals("/api/user/name/check") ||
                path.equals("/api/user") ||
                path.equals("/api/user/login") ||
                path.equals("/api/user/email/check") ||
                path.startsWith("/api/news") ||
                path.startsWith("/api/board/page") ||
                path.equals("/api/board/page_count") ||
                path.startsWith("/api/notice/page") ||
                path.equals(("/api/notice/page_count")) ||
                path.startsWith("/api/proxy/");
    }

    private String detachBearer(String token) {
        String jwtToken = token.substring(7);
        return jwtToken;
    }

}
