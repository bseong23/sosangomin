package com.ssafy.sosangomin.api.board.controller;

import com.ssafy.sosangomin.api.board.docs.CommentSwagger;
import com.ssafy.sosangomin.api.board.domain.dto.request.CommentInsertRequestDto;
import com.ssafy.sosangomin.api.board.domain.dto.request.CommentUpdateRequestDto;
import com.ssafy.sosangomin.api.board.domain.dto.response.CommentResponseDto;
import com.ssafy.sosangomin.api.board.service.CommentService;
import com.ssafy.sosangomin.common.annotation.DecryptedId;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/comment")
@RequiredArgsConstructor
public class CommentController implements CommentSwagger {

    private final CommentService commentService;

    @GetMapping("/{boardId}")
    public ResponseEntity<List<CommentResponseDto>> getComment(@PathVariable Long boardId,
                                                               @DecryptedId @RequestParam(required = false) Long userId) {
        return ResponseEntity.ok().body(commentService.findByBoardId(boardId, userId));
    }

    @PostMapping("/{boardId}")
    public ResponseEntity<?> insertComment(@PathVariable Long boardId,
                                           @RequestBody CommentInsertRequestDto commentInsertRequestDto,
                                           Principal principal) {
        // 로그인한 user pk
        Long userId = Long.parseLong(principal.getName());
        commentService.insertComment(commentInsertRequestDto, boardId, userId);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{commentId}")
    public ResponseEntity<?> updateComment(@PathVariable Long commentId,
                                           @RequestBody CommentUpdateRequestDto commentUpdateRequestDto,
                                           Principal principal) {
        // 로그인한 user pk
        Long userId = Long.parseLong(principal.getName());
        commentService.updateComment(commentUpdateRequestDto, commentId, userId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<?> deleteComment(@PathVariable Long commentId, Principal principal) {
        // 로그인한 user pk
        Long userId = Long.parseLong(principal.getName());
        commentService.deleteComment(commentId, userId);
        return ResponseEntity.ok().build();
    }
}
