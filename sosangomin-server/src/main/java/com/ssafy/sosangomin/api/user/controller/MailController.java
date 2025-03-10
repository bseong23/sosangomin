package com.ssafy.sosangomin.api.user.controller;

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
    public ResponseEntity<?> mailSend(@RequestParam("mail") String mail) {

        try {
            mailService.createAndSendMail(mail);
        } catch (MessagingException e) {
            return ResponseEntity.internalServerError().body(new InternalServerException(ErrorMessage.ERR_INTERNAL_SERVER_MAIL_SEND_FAIL_ERROR));
        }

        return ResponseEntity.ok().build();
    }

    @PostMapping("/check")
    public ResponseEntity<?> mailCheck(@RequestParam("mail") String mail, @RequestParam("userNumber") int userNumber) {

        boolean isMatch = mailService.checkVerification(mail, userNumber);

        if (!isMatch) {
            return ResponseEntity.badRequest().body(new BadRequestException(ErrorMessage.ERR_INVALID_MAIL_NUMBER));
        }

        return ResponseEntity.ok().build();
    }
}
