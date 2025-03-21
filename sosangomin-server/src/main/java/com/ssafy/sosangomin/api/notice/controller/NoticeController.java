package com.ssafy.sosangomin.api.notice.controller;

import com.ssafy.sosangomin.api.notice.docs.NoticeSwagger;
import com.ssafy.sosangomin.api.notice.domain.dto.request.NoticeInsertRequestDto;
import com.ssafy.sosangomin.api.notice.service.NoticeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
@RequestMapping("/api/notice")
@RequiredArgsConstructor
public class NoticeController implements NoticeSwagger {

    private final NoticeService noticeService;

    @PostMapping
    public ResponseEntity<?> insertNotice(@RequestBody NoticeInsertRequestDto noticeInsertRequestDto,
                                          Principal principal) {
        // 로그인한 user pk
        Long userId = Long.parseLong(principal.getName());
        return ResponseEntity.ok(noticeService.insertNotice(noticeInsertRequestDto, userId));
    }

}
