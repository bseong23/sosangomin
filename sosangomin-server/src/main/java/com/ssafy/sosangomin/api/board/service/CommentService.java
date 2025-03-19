package com.ssafy.sosangomin.api.board.service;

import com.ssafy.sosangomin.api.board.domain.dto.response.CommentResponseDto;
import com.ssafy.sosangomin.api.board.domain.entity.Board;
import com.ssafy.sosangomin.api.board.mapper.BoardMapper;
import com.ssafy.sosangomin.api.board.mapper.CommentMapper;
import com.ssafy.sosangomin.common.exception.ErrorMessage;
import com.ssafy.sosangomin.common.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentMapper commentMapper;
    private final BoardMapper boardMapper;

    public List<CommentResponseDto> findByBoardId(Long boardId) {
        Optional<Board> boardOptional = boardMapper.findBoardById(boardId);
        if (!boardOptional.isPresent()) {
            throw new NotFoundException(ErrorMessage.ERR_BOARD_NOT_FOUND);
        }
        return commentMapper.findCommentResponseDtoByBoardId(boardId);
    }
}
