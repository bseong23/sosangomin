package com.ssafy.sosangomin.api.board.service;

import com.ssafy.sosangomin.api.board.domain.dto.response.BoardResponseDto;
import com.ssafy.sosangomin.api.board.domain.entity.Board;
import com.ssafy.sosangomin.api.board.mapper.BoardMapper;
import com.ssafy.sosangomin.api.news.domain.dto.response.PageCountResponseDto;
import com.ssafy.sosangomin.common.exception.ErrorMessage;
import com.ssafy.sosangomin.common.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BoardService {

    private final BoardMapper boardMapper;

    @Transactional
    public BoardResponseDto getBoard(Long boardId) {
        Optional<BoardResponseDto> boardOptional = boardMapper.findBoardById(boardId);
        if (!boardOptional.isPresent()) {
            throw new NotFoundException(ErrorMessage.ERR_BOARD_NOT_FOUND);
        }
        boardMapper.incrementBoardViews(boardId);

        BoardResponseDto boardResponseDto = boardOptional.get();
        return boardResponseDto.incrementViews();
    }

    public List<BoardResponseDto> getBoardsByPageNum(int pageNum) {
        int offset = (pageNum - 1) * 10;
        List<BoardResponseDto> boards = boardMapper.findBoardsByPageNum(offset);
        return boards;
    }

    public PageCountResponseDto getBoardsPageCount() {
        return new PageCountResponseDto(boardMapper.getBoardsPageCount());
    }

}
