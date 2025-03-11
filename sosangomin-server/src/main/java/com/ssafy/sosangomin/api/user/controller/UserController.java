package com.ssafy.sosangomin.api.user.controller;

import com.ssafy.sosangomin.api.user.docs.UserSwagger;
import com.ssafy.sosangomin.api.user.dto.request.NameCheckRequestDto;
import com.ssafy.sosangomin.api.user.dto.request.SignUpRequestDto;
import com.ssafy.sosangomin.api.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController implements UserSwagger {

    private final UserService userService;

    @PostMapping("/name/check")
    public ResponseEntity<?> checkName(@ModelAttribute NameCheckRequestDto nameCheckRequestDto) {
        userService.checkNameDuplication(nameCheckRequestDto.name());
        return ResponseEntity.ok().build();
    }

    @PostMapping
    public ResponseEntity<?> signUp(@ModelAttribute SignUpRequestDto signUpRequestDto) {
        userService.signUp(signUpRequestDto);
        return ResponseEntity.ok().build();
    }
}
