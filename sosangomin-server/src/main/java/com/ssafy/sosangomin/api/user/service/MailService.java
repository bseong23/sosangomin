package com.ssafy.sosangomin.api.user.service;

import com.ssafy.sosangomin.api.user.domain.dto.request.MailSendRequestDto;
import com.ssafy.sosangomin.api.user.domain.entity.User;
import com.ssafy.sosangomin.api.user.mapper.UserMapper;
import com.ssafy.sosangomin.common.exception.BadRequestException;
import com.ssafy.sosangomin.common.exception.ErrorMessage;
import com.ssafy.sosangomin.common.exception.InternalServerException;
import com.ssafy.sosangomin.common.exception.NotFoundException;
import com.ssafy.sosangomin.common.util.JwtTokenUtil;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class MailService {

    private final UserMapper userMapper;

    private final JavaMailSender javaMailSender;
    private final StringRedisTemplate redisTemplate;
    private final JwtTokenUtil jwtTokenUtil;

    private static final String VERIFICATION_PREFIX = "email-verify:";
    private static final int VERIFICATION_EXPIRE_MINUTES = 5;

    @Value("${frontend-url}")
    private String frontendUrl;

    @Value("${spring.mail.username}")
    private String senderEmail;

    @Async
    public void createAndSendEmailVerifyMail(MailSendRequestDto mailSendRequestDto) {
        int number = createVerification(mailSendRequestDto.mail());
        MimeMessage message = javaMailSender.createMimeMessage();

        try {
            message.setFrom(senderEmail);
            message.setRecipients(MimeMessage.RecipientType.TO, mailSendRequestDto.mail());
            message.setSubject("이메일 인증");
            String body = "";
            body += "<h3>" + "요청하신 인증 번호입니다." + "</h3>";
            body += "<h1>" + number + "</h1>";
            body += "<h3>" + "감사합니다." + "</h3>";
            message.setText(body,"UTF-8", "html");

            javaMailSender.send(message);

        } catch (MessagingException e) {
            throw new InternalServerException(ErrorMessage.ERR_INTERNAL_SERVER_MAIL_SEND_FAIL_ERROR);
        }
    }

    @Async
    public void createAndSendPasswordResetMail(MailSendRequestDto mailSendRequestDto) {

        Optional<User> userOptional = userMapper.findUserByEmail(mailSendRequestDto.mail());

        if (!userOptional.isPresent()) {
            throw new NotFoundException(ErrorMessage.ERR_USER_NOT_FOUND);
        }

        Long userId = userOptional.get().getUserId();
        String accessToken = jwtTokenUtil.createFiveMinuteAccessToken(userId.toString());
        String link = frontendUrl + "/password" + "?accessToken=" + accessToken;

        MimeMessage message = javaMailSender.createMimeMessage();

        try {
            message.setFrom(senderEmail);
            message.setRecipients(MimeMessage.RecipientType.TO, mailSendRequestDto.mail());
            message.setSubject("비밀번호 재설정 링크");
            String body = "";
            body += "<h3>" + "비밀번호 재설정 링크입니다." + "</h3>";
            body += "<h5>" + link + "</h5>";
            body += "<h3>" + "감사합니다." + "</h3>";
            message.setText(body,"UTF-8", "html");

            javaMailSender.send(message);

        } catch (MessagingException e) {
            throw new InternalServerException(ErrorMessage.ERR_INTERNAL_SERVER_MAIL_SEND_FAIL_ERROR);
        }
    }

    public void checkVerification(String mail, int userNumber) {
        String redisKey = VERIFICATION_PREFIX + mail;

        // Redis에 저장된 인증번호 조회
        String storedNumber = redisTemplate.opsForValue().get(redisKey);

        if (storedNumber == null || !storedNumber.equals(String.valueOf(userNumber))) {
            throw new BadRequestException(ErrorMessage.ERR_INVALID_MAIL_NUMBER);
        }

        // 인증 성공 시 Redis에서 인증번호 삭제
        redisTemplate.delete(redisKey);
    }

    private int createVerification(String email) {

        int verificationNumber = createNumber();

        // Redis에 저장할 키 생성
        String redisKey = VERIFICATION_PREFIX + email;

        // 인증번호를 Redis에 저장 (5분 후 만료)
        redisTemplate.opsForValue().set(
                redisKey,
                String.valueOf(verificationNumber),
                VERIFICATION_EXPIRE_MINUTES,
                TimeUnit.MINUTES
        );

        return verificationNumber;
    }

    // 랜덤 숫자 생성
    private int createNumber() {
        return (int)(Math.random() * (90000)) + 100000;
    }

}
