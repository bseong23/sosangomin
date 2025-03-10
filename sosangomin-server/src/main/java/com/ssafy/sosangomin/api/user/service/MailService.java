package com.ssafy.sosangomin.api.user.service;

import com.ssafy.sosangomin.common.exception.BadRequestException;
import com.ssafy.sosangomin.common.exception.ErrorMessage;
import com.ssafy.sosangomin.common.exception.InternalServerException;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class MailService {

    private final JavaMailSender javaMailSender;

    @Value("${spring.mail.username}")
    private String senderEmail;

    @Value("${spring.mail.verification.expiry-minutes}")
    private long expiryMinutes;

    // 각 사용자의 인증 번호를 저장하는 맵
    private final ConcurrentHashMap<String, VerificationInfo> emailVerificationMap = new ConcurrentHashMap<>();

    @Async
    public void createAndSendMail(String mail) {
        int number = createNumber();
        MimeMessage message = javaMailSender.createMimeMessage();

        try {
            message.setFrom(senderEmail);
            message.setRecipients(MimeMessage.RecipientType.TO, mail);
            message.setSubject("이메일 인증");
            String body = "";
            body += "<h3>" + "요청하신 인증 번호입니다." + "</h3>";
            body += "<h1>" + number + "</h1>";
            body += "<h3>" + "감사합니다." + "</h3>";
            message.setText(body,"UTF-8", "html");

            javaMailSender.send(message);

            // 인증번호와 만료 시간을 함께 저장
            LocalDateTime expiryTime = LocalDateTime.now().plusMinutes(expiryMinutes);
            emailVerificationMap.put(mail, new VerificationInfo(number, expiryTime));
        } catch (MessagingException e) {
            throw new InternalServerException(ErrorMessage.ERR_INTERNAL_SERVER_MAIL_SEND_FAIL_ERROR);
        }
    }

    // 랜덤 숫자 생성
    private int createNumber() {
        return (int)(Math.random() * (90000)) + 100000;
    }

    public void checkVerification(String mail, int userNumber) {
        int storedNumber = getVerificationNumber(mail);
        boolean isMatch = storedNumber == userNumber;

        // 인증에 성공하면 맵에서 제거
        if (isMatch) {
            emailVerificationMap.remove(mail);
        } else {
            throw new BadRequestException(ErrorMessage.ERR_INVALID_MAIL_NUMBER);
        }
    }

    public int getVerificationNumber(String mail) {
        VerificationInfo info = emailVerificationMap.get(mail);
        if (info == null || info.isExpired()) {
            return -1; // 인증정보가 없거나 만료된 경우
        }
        return info.getNumber();
    }

    // 5분마다 실행되어 만료된 인증 정보를 제거하는 스케줄 작업
    @Scheduled(fixedRate = 300000) // 5분(300000ms)마다 실행
    public void cleanupExpiredVerifications() {
        LocalDateTime now = LocalDateTime.now();

        emailVerificationMap.entrySet().removeIf(entry -> {
            VerificationInfo info = entry.getValue();
            return info.isExpired();
        });
    }

    // 인증 정보를 저장하는 내부 클래스
    private static class VerificationInfo {
        private final int number;
        private final LocalDateTime expiryTime;

        public VerificationInfo(int number, LocalDateTime expiryTime) {
            this.number = number;
            this.expiryTime = expiryTime;
        }

        public int getNumber() {
            return number;
        }

        public LocalDateTime getExpiryTime() {
            return expiryTime;
        }

        public boolean isExpired() {
            return LocalDateTime.now().isAfter(expiryTime);
        }
    }
}
