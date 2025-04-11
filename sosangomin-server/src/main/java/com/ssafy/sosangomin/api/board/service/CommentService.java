package com.ssafy.sosangomin.api.board.service;

import com.ssafy.sosangomin.api.board.domain.dto.request.CommentInsertRequestDto;
import com.ssafy.sosangomin.api.board.domain.dto.request.CommentUpdateRequestDto;
import com.ssafy.sosangomin.api.board.domain.dto.response.CommentResponseDto;
import com.ssafy.sosangomin.api.board.domain.dto.response.CommentResponseTempDto;
import com.ssafy.sosangomin.api.board.domain.entity.Board;
import com.ssafy.sosangomin.api.board.domain.entity.Comment;
import com.ssafy.sosangomin.api.board.mapper.BoardMapper;
import com.ssafy.sosangomin.api.board.mapper.CommentMapper;
import com.ssafy.sosangomin.common.exception.ErrorMessage;
import com.ssafy.sosangomin.common.exception.NotFoundException;
import com.ssafy.sosangomin.common.exception.UnAuthorizedException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentMapper commentMapper;
    private final BoardMapper boardMapper;

    public List<CommentResponseDto> findByBoardId(Long boardId, Long userId) {
        Optional<Board> boardOptional = boardMapper.findBoardById(boardId);
        if (!boardOptional.isPresent()) {
            throw new NotFoundException(ErrorMessage.ERR_BOARD_NOT_FOUND);
        }

        List<CommentResponseTempDto> tempCommentList = commentMapper.findCommentResponseDtoByBoardId(boardId);
        List<CommentResponseDto> commentResponseDtoList = new ArrayList<>();

        if (userId != null) {
            for (CommentResponseTempDto tempDto : tempCommentList) {
                commentResponseDtoList.add(CommentResponseDto.checkVerifiedAndReturn(userId, tempDto));
            }
        }
        else {
            for (CommentResponseTempDto tempDto : tempCommentList) {
                commentResponseDtoList.add(CommentResponseDto.of(tempDto));
            }
        }
        return commentResponseDtoList;
    }

    @Transactional
    public void insertComment(CommentInsertRequestDto commentInsertRequestDto,
                              Long boardId,
                              Long userId) {
        Optional<Board> boardOptional = boardMapper.findBoardById(boardId);
        if (!boardOptional.isPresent()) {
            throw new NotFoundException(ErrorMessage.ERR_BOARD_NOT_FOUND);
        }
        commentMapper.insertComment(boardId, userId, commentInsertRequestDto.content());
    }

    @Transactional
    public void updateComment(CommentUpdateRequestDto commentUpdateRequestDto,
                              Long commentId,
                              Long userId) {
        Optional<Comment> commentOptional = commentMapper.findByCommentId(commentId);
        if (!commentOptional.isPresent()) {
            throw new NotFoundException(ErrorMessage.ERR_COMMENT_NOT_FOUND);
        }
        Comment comment = commentOptional.get();
        if (!comment.getCommenterId().equals(userId)) {
            throw new UnAuthorizedException(ErrorMessage.ERR_USER_COMMENT_NOT_MATCH);
        }
        commentMapper.updateComment(commentUpdateRequestDto.content(), commentId);
    }

    @Transactional
    public void deleteComment(Long commentId, Long userId) {
        Optional<Comment> commentOptional = commentMapper.findByCommentId(commentId);
        if (!commentOptional.isPresent()) {
            throw new NotFoundException(ErrorMessage.ERR_COMMENT_NOT_FOUND);
        }

        Comment comment = commentOptional.get();

        if (!comment.getCommenterId().equals(userId)) {
            throw new UnAuthorizedException(ErrorMessage.ERR_USER_COMMENT_NOT_MATCH);
        }

        commentMapper.deleteComment(commentId);
    }
}
