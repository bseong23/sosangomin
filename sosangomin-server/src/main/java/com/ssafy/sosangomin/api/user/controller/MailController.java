package com.ssafy.sosangomin.api.user.controller;

import com.ssafy.sosangomin.api.user.service.MailService;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/mail")
@RequiredArgsConstructor
public class MailController {

    private final MailService mailService;

    @PostMapping("/mailSend")
    public ResponseEntity<?> mailSend(String mail) {

        try {
            mailService.createAndSendMail(mail);
        } catch (MessagingException e) {
            return ResponseEntity.status(500).body("메일 전송 실패");
        }

        return ResponseEntity.ok("메일 전송 성공");
    }

    @PostMapping("/mailCheck")
    public ResponseEntity<?> mailCheck(@RequestParam String mail, @RequestParam int userNumber) {

        boolean isMatch = mailService.checkVerification(mail, userNumber);

        return ResponseEntity.ok(isMatch);
    }
}
