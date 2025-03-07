package com.ssafy.sosangomin.api.user.service;

import com.ssafy.sosangomin.api.user.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserMapper userMapper;

    @Override
    public UserDetails loadUserByUsername(String id) throws UsernameNotFoundException {
        return userMapper.findUserById(Long.parseLong(id))
//                .orElseThrow(() -> new NotFoundException(ErrorMessage.ERR_NOT_FOUND_USER));
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }
}