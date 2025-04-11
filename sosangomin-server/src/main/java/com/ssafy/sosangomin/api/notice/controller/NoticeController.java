package com.ssafy.sosangomin.api.notice.controller;

import com.ssafy.sosangomin.api.notice.docs.NoticeSwagger;
import com.ssafy.sosangomin.api.notice.domain.dto.request.NoticeInsertRequestDto;
import com.ssafy.sosangomin.api.notice.domain.dto.request.NoticeUpdateRequestDto;
import com.ssafy.sosangomin.api.notice.domain.dto.response.NoticeResponseDto;
import com.ssafy.sosangomin.api.notice.service.NoticeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

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

    @PutMapping("/{noticeId}")
    public ResponseEntity<?> updateNotice(@PathVariable Long noticeId,
                                         @RequestBody NoticeUpdateRequestDto noticeUpdateRequestDto,
                                         Principal principal) {
        // 로그인한 user pk
        Long userId = Long.parseLong(principal.getName());
        noticeService.updateNotice(noticeUpdateRequestDto, noticeId, userId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{noticeId}")
    public ResponseEntity<?> deleteNotice(@PathVariable Long noticeId, Principal principal) {
        // 로그인한 user pk
        Long userId = Long.parseLong(principal.getName());
        noticeService.deleteNotice(noticeId, userId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{noticeId}")
    public ResponseEntity<?> getNotice(@PathVariable Long noticeId) {
        return ResponseEntity.ok(noticeService.getNotice(noticeId));
    }

    @GetMapping("/page/{pageNum}")
    public ResponseEntity<List<NoticeResponseDto>> getNotices(
            @PathVariable int pageNum) {
        return ResponseEntity.ok().body(noticeService.getNoticesByPageNum(pageNum));
    }

    @GetMapping("/page_count")
    public ResponseEntity<?> getPageCount() {
        return ResponseEntity.ok().body(noticeService.getNoticesPageCount());
    }

    @GetMapping("/verify")
    public ResponseEntity<?> verify(Principal principal) {
        // 로그인한 user pk
        Long userId = Long.parseLong(principal.getName());
        noticeService.verifyIsAdmin(userId);
        return ResponseEntity.ok().build();
    }
}
