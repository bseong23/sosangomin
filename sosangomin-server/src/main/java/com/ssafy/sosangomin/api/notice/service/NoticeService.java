package com.ssafy.sosangomin.api.notice.service;

import com.ssafy.sosangomin.api.notice.domain.dto.request.NoticeInsertRequestDto;
import com.ssafy.sosangomin.api.notice.domain.dto.response.NoticeInsertResponseDto;
import com.ssafy.sosangomin.api.notice.mapper.NoticeMapper;
import com.ssafy.sosangomin.api.user.domain.entity.User;
import com.ssafy.sosangomin.api.user.domain.entity.UserRole;
import com.ssafy.sosangomin.api.user.mapper.UserMapper;
import com.ssafy.sosangomin.common.exception.ErrorMessage;
import com.ssafy.sosangomin.common.exception.UnAuthorizedException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
}
