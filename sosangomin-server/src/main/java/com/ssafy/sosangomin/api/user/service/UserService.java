package com.ssafy.sosangomin.api.user.service;

import com.ssafy.sosangomin.api.user.domain.entity.User;
import com.ssafy.sosangomin.api.user.mapper.UserMapper;
import com.ssafy.sosangomin.common.exception.BadRequestException;
import com.ssafy.sosangomin.common.exception.ErrorMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserMapper userMapper;

    public void checkNameDuplication(String name) {

        Optional<User> user = userMapper.findUserByName(name);

        if (user.isPresent()) {
            throw new BadRequestException(ErrorMessage.ERR_NAME_DUPLICATE);
        }
    }
}
