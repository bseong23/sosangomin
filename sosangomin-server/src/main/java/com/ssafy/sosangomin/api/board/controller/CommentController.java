package com.ssafy.sosangomin.api.board.controller;

import com.ssafy.sosangomin.api.board.docs.CommentSwagger;
import com.ssafy.sosangomin.api.board.domain.dto.request.CommentInsertRequestDto;
import com.ssafy.sosangomin.api.board.domain.dto.response.CommentResponseDto;
import com.ssafy.sosangomin.api.board.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@Controller
@RequestMapping("/api/comment")
@RequiredArgsConstructor
public class CommentController implements CommentSwagger {

    private final CommentService commentService;

    @GetMapping("/{boardId}")
    public ResponseEntity<List<CommentResponseDto>> getComment(@PathVariable Long boardId) {
        return ResponseEntity.ok().body(commentService.findByBoardId(boardId));
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
}
