package com.ssafy.sosangomin.api.user.controller;

import com.ssafy.sosangomin.api.user.docs.UserSwagger;
import com.ssafy.sosangomin.api.user.dto.request.*;
import com.ssafy.sosangomin.api.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController implements UserSwagger {

    private final UserService userService;

    @PostMapping("/name/check")
    public ResponseEntity<?> checkName(@ModelAttribute NameCheckRequestDto nameCheckRequestDto) {
        userService.checkNameDuplication(nameCheckRequestDto);
        return ResponseEntity.ok().build();
    }

    @PostMapping
    public ResponseEntity<?> signUp(@ModelAttribute SignUpRequestDto signUpRequestDto) {
        userService.signUp(signUpRequestDto);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@ModelAttribute LoginRequestDto loginRequestDto) {
        return ResponseEntity.ok().body(userService.login(loginRequestDto));
    }

    @PostMapping("/email/check")
    public ResponseEntity<?> checkEmail(@ModelAttribute EmailCheckRequestDto emailCheckRequestDto) {
        userService.checkEmailDuplication(emailCheckRequestDto);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/name")
    public ResponseEntity<?> updateName(Principal principal, @ModelAttribute UpdateNameRequestDto updateNameRequestDto) {
        // 로그인한 user pk
        Long userId = Long.parseLong(principal.getName());
        userService.updateName(updateNameRequestDto, userId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/password")
    public ResponseEntity<?> updatePassword(Principal principal, @ModelAttribute UpdatePasswordRequestDto updatePasswordRequestDto) {
        // 로그인한 user pk
        Long userId = Long.parseLong(principal.getName());
        userService.updatePassword(updatePasswordRequestDto, userId);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<?> getUserInfo(Principal principal) {
        // 로그인한 user pk
        Long userId = Long.parseLong(principal.getName());
        return ResponseEntity.ok().body(userService.getUserInfo(userId));
    }

    @PutMapping("/profile_img")
    public ResponseEntity<?> updateProfileImg(Principal principal, @RequestParam MultipartFile profileImg) {
        // 로그인한 user pk
        Long userId = Long.parseLong(principal.getName());
        userService.updateProfileImg(profileImg, userId);
        return ResponseEntity.ok().build();
    }
}
