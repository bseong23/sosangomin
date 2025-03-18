package com.ssafy.sosangomin.api.board.service;

import com.ssafy.sosangomin.api.board.domain.dto.response.BoardResponseDto;
import com.ssafy.sosangomin.api.board.mapper.BoardMapper;
import com.ssafy.sosangomin.api.news.domain.dto.response.PageCountResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BoardService {

    private final BoardMapper boardMapper;

    @Transactional
    public List<BoardResponseDto> getBoardsByPageNum(int pageNum) {
        int offset = (pageNum - 1) * 10;
        List<BoardResponseDto> boards = boardMapper.findBoardsByPageNum(offset);
        return boards;
    }

    public PageCountResponseDto getBoardsPageCount() {
        return new PageCountResponseDto(boardMapper.getBoardsPageCount());
    }

}
