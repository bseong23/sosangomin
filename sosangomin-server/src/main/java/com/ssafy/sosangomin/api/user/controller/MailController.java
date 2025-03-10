package com.ssafy.sosangomin.api.user.controller;

import com.ssafy.sosangomin.api.user.dto.request.MailCheckRequestDto;
import com.ssafy.sosangomin.api.user.dto.request.MailSendRequestDto;
import com.ssafy.sosangomin.api.user.service.MailService;
import com.ssafy.sosangomin.common.exception.BadRequestException;
import com.ssafy.sosangomin.common.exception.ErrorMessage;
import com.ssafy.sosangomin.common.exception.InternalServerException;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/mail")
@RequiredArgsConstructor
public class MailController {

    private final MailService mailService;

    @PostMapping()
    public ResponseEntity<?> mailSend(@ModelAttribute MailSendRequestDto mailSendRequestDto) {
        mailService.createAndSendMail(mailSendRequestDto.email());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/check")
    public ResponseEntity<?> mailCheck(@ModelAttribute MailCheckRequestDto mailCheckRequestDto) {
        mailService.checkVerification(mailCheckRequestDto.email(), mailCheckRequestDto.userNumber());
        return ResponseEntity.ok().build();
    }
}
