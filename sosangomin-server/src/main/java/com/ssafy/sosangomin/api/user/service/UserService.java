package com.ssafy.sosangomin.api.user.service;

import com.ssafy.sosangomin.api.user.domain.entity.User;
import com.ssafy.sosangomin.api.user.dto.request.*;
import com.ssafy.sosangomin.api.user.dto.response.LoginResponseDto;
import com.ssafy.sosangomin.api.user.mapper.UserMapper;
import com.ssafy.sosangomin.common.exception.BadRequestException;
import com.ssafy.sosangomin.common.exception.ErrorMessage;
import com.ssafy.sosangomin.common.util.IdEncryptionUtil;
import com.ssafy.sosangomin.common.util.JwtTokenUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenUtil jwtTokenUtil;
    private final IdEncryptionUtil idEncryptionUtil;

    public void checkNameDuplication(NameCheckRequestDto nameCheckRequestDto) {
        Optional<User> user = userMapper.findUserByName(nameCheckRequestDto.name());

        if (user.isPresent()) {
            throw new BadRequestException(ErrorMessage.ERR_NAME_DUPLICATE);
        }
    }

    public void signUp(SignUpRequestDto signUpRequestDto) {
        userMapper.signUpUser(
                signUpRequestDto.mail(),
                signUpRequestDto.name(),
                passwordEncoder.encode(signUpRequestDto.password()));
    }

    public LoginResponseDto login(LoginRequestDto loginRequestDto) {

        Optional<User> userOptional = userMapper.findUserByEmail(loginRequestDto.mail());

        if (!userOptional.isPresent()) {
            throw new BadRequestException(ErrorMessage.ERR_LOGIN_FAILED);
        }

        User user = userOptional.get();

        // 비밀번호 검증
        if (!passwordEncoder.matches(loginRequestDto.password(), user.getPassword())) {
            throw new BadRequestException(ErrorMessage.ERR_LOGIN_FAILED);
        }

        // JWT 토큰 생성
        String accessToken = jwtTokenUtil.createAccessToken(String.valueOf(user.getId()));

        // 암호화된 유저 id (pk)
        String encryptedUserId = idEncryptionUtil.encrypt(user.getId());

        return new LoginResponseDto(
                accessToken,
                user.getName(),
                user.getProfileImgUrl(),
                "false",
                encryptedUserId
        );
    }

    public void checkEmailDuplication(EmailCheckRequestDto emailCheckRequestDto) {
        Optional<User> user = userMapper.findUserByEmail(emailCheckRequestDto.email());

        if (user.isPresent()) {
            throw new BadRequestException(ErrorMessage.ERR_EMAIL_DUPLICATE);
        }
    }

    @Transactional
    public void updateName(UpdateNameRequestDto updateNameRequestDto, Long userId) {

        // 여기서 중복검사 한번 더 진행
        Optional<User> user = userMapper.findUserByName(updateNameRequestDto.name());

        if (user.isPresent()) {
            throw new BadRequestException(ErrorMessage.ERR_NAME_DUPLICATE);
        }

        // 중복 안되면 업데이트 진행
        userMapper.updateName(updateNameRequestDto.name(), userId);
    }

    public void updatePassword(UpdatePasswordRequestDto updatePasswordRequestDto, Long userId) {
        userMapper.updatePassword(
                passwordEncoder.encode(updatePasswordRequestDto.password()),
                userId
        );
    }
}
