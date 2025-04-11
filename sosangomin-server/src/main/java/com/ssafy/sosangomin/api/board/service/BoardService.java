package com.ssafy.sosangomin.api.board.service;

import com.ssafy.sosangomin.api.board.domain.dto.request.BoardInsertRequestDto;
import com.ssafy.sosangomin.api.board.domain.dto.response.BoardInsertResponseDto;
import com.ssafy.sosangomin.api.board.domain.dto.response.BoardResponseDto;
import com.ssafy.sosangomin.api.board.domain.entity.Board;
import com.ssafy.sosangomin.api.board.mapper.BoardMapper;
import com.ssafy.sosangomin.api.board.domain.dto.request.BoardUpdateRequestDto;
import com.ssafy.sosangomin.api.news.domain.dto.response.PageCountResponseDto;
import com.ssafy.sosangomin.common.exception.ErrorMessage;
import com.ssafy.sosangomin.common.exception.NotFoundException;
import com.ssafy.sosangomin.common.exception.UnAuthorizedException;
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
    public BoardInsertResponseDto insertBoard(BoardInsertRequestDto boardInsertRequestDto, Long userId) {
        boardMapper.insertBoard(userId, boardInsertRequestDto.title(), boardInsertRequestDto.content());
        return new BoardInsertResponseDto(boardMapper.lastInsertId());
    }

    @Transactional
    public BoardResponseDto getBoard(Long boardId) {
        Optional<BoardResponseDto> boardOptional = boardMapper.findBoardResponseDtoById(boardId);
        if (!boardOptional.isPresent()) {
            throw new NotFoundException(ErrorMessage.ERR_BOARD_NOT_FOUND);
        }
        boardMapper.incrementBoardViews(boardId);

        BoardResponseDto boardResponseDto = boardOptional.get();
        return boardResponseDto.incrementViews();
    }

    @Transactional
    public void updateBoard(BoardUpdateRequestDto boardUpdateRequestDto, Long boardId, Long userId) {
        Optional<Board> boardOriginalOptional = boardMapper.findBoardById(boardId);

        if (!boardOriginalOptional.isPresent()) {
            throw new NotFoundException(ErrorMessage.ERR_BOARD_NOT_FOUND);
        }

        Board boardOriginal = boardOriginalOptional.get();

        if (!boardOriginal.getUserId().equals(userId)) {
            throw new UnAuthorizedException(ErrorMessage.ERR_USER_BOARD_NOT_MATCH);
        }

        boardMapper.updateBoard(boardId, boardUpdateRequestDto.title(), boardUpdateRequestDto.content());
    }

    @Transactional
    public void deleteBoard(Long boardId, Long userId) {
        Optional<Board> boardOriginalOptional = boardMapper.findBoardById(boardId);

        if (!boardOriginalOptional.isPresent()) {
            throw new NotFoundException(ErrorMessage.ERR_BOARD_NOT_FOUND);
        }

        Board boardOriginal = boardOriginalOptional.get();

        if (!boardOriginal.getUserId().equals(userId)) {
            throw new UnAuthorizedException(ErrorMessage.ERR_USER_BOARD_NOT_MATCH);
        }

        boardMapper.deleteBoard(boardId);
    }

    public List<BoardResponseDto> getBoardsByPageNum(int pageNum) {
        int offset = (pageNum - 1) * 10;
        List<BoardResponseDto> boards = boardMapper.findBoardsByPageNum(offset);
        return boards;
    }

    public PageCountResponseDto getBoardsPageCount() {
        return new PageCountResponseDto(boardMapper.getBoardsPageCount());
    }

    public void verifyBoardUserMatch(Long boardId, Long userId) {
        Optional<Board> boardOptional = boardMapper.findBoardById(boardId);
        if (!boardOptional.isPresent()) {
            throw new NotFoundException(ErrorMessage.ERR_BOARD_NOT_FOUND);
        }
        Board board = boardOptional.get();

        if (!board.getUserId().equals(userId)) {
            throw new UnAuthorizedException(ErrorMessage.ERR_USER_BOARD_NOT_MATCH);
        }
    }

}
