package com.ssafy.sosangomin.api.user.controller;

import com.ssafy.sosangomin.api.user.docs.MailSwagger;
import com.ssafy.sosangomin.api.user.domain.dto.request.MailCertificateRequestDto;
import com.ssafy.sosangomin.api.user.domain.dto.request.MailSendRequestDto;
import com.ssafy.sosangomin.api.user.service.MailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/mail")
@RequiredArgsConstructor
public class MailController implements MailSwagger {

    private final MailService mailService;

    @PostMapping
    public ResponseEntity<?> mailSend(@ModelAttribute MailSendRequestDto mailSendRequestDto) {
        mailService.createAndSendEmailVerifyMail(mailSendRequestDto);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/verify")
    public ResponseEntity<?> mailVerify(@ModelAttribute MailCertificateRequestDto mailCertificateRequestDto) {
        mailService.checkVerification(mailCertificateRequestDto.mail(), mailCertificateRequestDto.userNumber());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/password")
    public ResponseEntity<?> passwordResetMailSend(@ModelAttribute MailSendRequestDto mailSendRequestDto) {
        mailService.createAndSendPasswordResetMail(mailSendRequestDto);
        return ResponseEntity.ok().build();
    }
}
