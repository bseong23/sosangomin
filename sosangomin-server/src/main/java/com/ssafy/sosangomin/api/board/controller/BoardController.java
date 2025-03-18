package com.ssafy.sosangomin.api.board.controller;

import com.ssafy.sosangomin.api.board.docs.BoardSwagger;
import com.ssafy.sosangomin.api.board.domain.dto.response.BoardResponseDto;
import com.ssafy.sosangomin.api.board.service.BoardService;
import com.ssafy.sosangomin.api.news.domain.dto.response.PageCountResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Controller
@RequestMapping("/api/board")
@RequiredArgsConstructor
public class BoardController implements BoardSwagger {

    private final BoardService boardService;

    @GetMapping("/page/{pageNum}")
    public ResponseEntity<List<BoardResponseDto>> getBoards(
            @PathVariable int pageNum) {
        return ResponseEntity.ok().body(boardService.getBoardsByPageNum(pageNum));
    }

    @GetMapping("/page_count")
    public ResponseEntity<PageCountResponseDto> getPageCount() {
        return ResponseEntity.ok().body(boardService.getBoardsPageCount());
    }
}
