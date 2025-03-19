package com.ssafy.sosangomin.api.board.controller;

import com.ssafy.sosangomin.api.board.docs.BoardSwagger;
import com.ssafy.sosangomin.api.board.domain.dto.request.BoardInsertRequestDto;
import com.ssafy.sosangomin.api.board.domain.dto.response.BoardResponseDto;
import com.ssafy.sosangomin.api.board.service.BoardService;
import com.ssafy.sosangomin.api.board.domain.dto.request.BoardUpdateRequestDto;
import com.ssafy.sosangomin.api.news.domain.dto.response.PageCountResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@Controller
@RequestMapping("/api/board")
@RequiredArgsConstructor
public class BoardController implements BoardSwagger {

    private final BoardService boardService;

    @PostMapping
    public ResponseEntity<?> insertBoard(@RequestBody BoardInsertRequestDto boardInsertRequestDto,
                                         Principal principal) {
        // 로그인한 user pk
        Long userId = Long.parseLong(principal.getName());
        boardService.insertBoard(boardInsertRequestDto, userId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{boardId}")
    public ResponseEntity<BoardResponseDto> getBoard(@PathVariable Long boardId) {
        return ResponseEntity.ok().body(boardService.getBoard(boardId));
    }

    @PutMapping("/{boardId}")
    public ResponseEntity<?> updateBoard(@PathVariable Long boardId,
                                         @RequestBody BoardUpdateRequestDto boardUpdateRequestDto,
                                         Principal principal) {
        // 로그인한 user pk
        Long userId = Long.parseLong(principal.getName());
        boardService.updateBoard(boardUpdateRequestDto, boardId, userId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{boardId}")
    public ResponseEntity<?> deleteBoard(@PathVariable Long boardId, Principal principal) {
        // 로그인한 user pk
        Long userId = Long.parseLong(principal.getName());
        boardService.deleteBoard(boardId, userId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/page/{pageNum}")
    public ResponseEntity<List<BoardResponseDto>> getBoards(
            @PathVariable int pageNum) {
        return ResponseEntity.ok().body(boardService.getBoardsByPageNum(pageNum));
    }

    @GetMapping("/page_count")
    public ResponseEntity<PageCountResponseDto> getPageCount() {
        return ResponseEntity.ok().body(boardService.getBoardsPageCount());
    }

    @GetMapping("/{boardId}/verify")
    public ResponseEntity<Boolean> verify(@PathVariable Long boardId, Principal principal) {
        // 로그인한 user pk
        Long userId = Long.parseLong(principal.getName());
        boardService.verifyBoardUserMatch(boardId, userId);
        return ResponseEntity.ok().build();
    }
}
