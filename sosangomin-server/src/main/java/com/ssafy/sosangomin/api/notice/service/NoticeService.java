package com.ssafy.sosangomin.api.notice.service;

import com.ssafy.sosangomin.api.news.domain.dto.response.PageCountResponseDto;
import com.ssafy.sosangomin.api.notice.domain.dto.request.NoticeInsertRequestDto;
import com.ssafy.sosangomin.api.notice.domain.dto.request.NoticeUpdateRequestDto;
import com.ssafy.sosangomin.api.notice.domain.dto.response.NoticeInsertResponseDto;
import com.ssafy.sosangomin.api.notice.domain.dto.response.NoticeResponseDto;
import com.ssafy.sosangomin.api.notice.domain.entity.Notice;
import com.ssafy.sosangomin.api.notice.mapper.NoticeMapper;
import com.ssafy.sosangomin.api.user.domain.entity.User;
import com.ssafy.sosangomin.api.user.domain.entity.UserRole;
import com.ssafy.sosangomin.api.user.mapper.UserMapper;
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
public class NoticeService {

    private final NoticeMapper noticeMapper;
    private final UserMapper userMapper;

    @Transactional
    public NoticeInsertResponseDto insertNotice(NoticeInsertRequestDto noticeInsertRequestDto, Long userId) {
        Optional<User> userOptional = userMapper.findUserById(userId);
        User user = userOptional.get();
        if (user.getUserRole() != UserRole.ADMIN) {
            System.out.println(user.getUserRole());
            throw new UnAuthorizedException(ErrorMessage.ERR_NOT_ALLOWD_USER);
        }
        noticeMapper.insertNotice(userId, noticeInsertRequestDto.title(), noticeInsertRequestDto.content());
        return new NoticeInsertResponseDto(noticeMapper.lastInsertId());
    }

    @Transactional
    public NoticeResponseDto getNotice(Long noticeId) {
        Optional<NoticeResponseDto> noticeOptional = noticeMapper.findNoticeResponseDtoById(noticeId);
        if (!noticeOptional.isPresent()) {
            throw new NotFoundException(ErrorMessage.ERR_NOTICE_NOT_FOUND);
        }

        noticeMapper.incrementNoticeViews(noticeId);

        NoticeResponseDto noticeResponseDto = noticeOptional.get();
        return noticeResponseDto.incrementViews();
    }

    @Transactional
    public void updateNotice(NoticeUpdateRequestDto noticeUpdateRequestDto, Long noticeId, Long userId) {
        Optional<Notice> noticeOriginalOptional = noticeMapper.findNoticeById(noticeId);

        if (!noticeOriginalOptional.isPresent()) {
            throw new NotFoundException(ErrorMessage.ERR_NOTICE_NOT_FOUND);
        }
        Optional<User> userOptional = userMapper.findUserById(userId);
        User user = userOptional.get();
        if (user.getUserRole() != UserRole.ADMIN) {
            throw new UnAuthorizedException(ErrorMessage.ERR_NOT_ALLOWD_USER);
        }

        noticeMapper.updateNotice(noticeId, noticeUpdateRequestDto.title(), noticeUpdateRequestDto.content());
    }

    @Transactional
    public void deleteNotice(Long noticeId, Long userId) {
        Optional<Notice> noticeOriginalOptional = noticeMapper.findNoticeById(noticeId);

        if (!noticeOriginalOptional.isPresent()) {
            throw new NotFoundException(ErrorMessage.ERR_NOTICE_NOT_FOUND);
        }
        Optional<User> userOptional = userMapper.findUserById(userId);
        User user = userOptional.get();
        if (user.getUserRole() != UserRole.ADMIN) {
            throw new UnAuthorizedException(ErrorMessage.ERR_NOT_ALLOWD_USER);
        }

        noticeMapper.deleteNotice(noticeId);
    }

    public List<NoticeResponseDto> getNoticesByPageNum(int pageNum) {
        int offset = (pageNum - 1) * 10;
        List<NoticeResponseDto> notices = noticeMapper.findNoticesByPageNum(offset);
        return notices;
    }

    public PageCountResponseDto getNoticesPageCount() {
        return new PageCountResponseDto(noticeMapper.getNoticesPageCount());
    }

    public void verifyIsAdmin(Long userId) {
        Optional<User> userOptional = userMapper.findUserById(userId);
        if (!userOptional.isPresent()) {
            throw new NotFoundException(ErrorMessage.ERR_USER_NOT_FOUND);
        }
        User user = userOptional.get();
        if (user.getUserRole() != UserRole.ADMIN) {
            throw new UnAuthorizedException(ErrorMessage.ERR_NOT_ALLOWD_USER);
        }
    }
}
