package com.ssafy.sosangomin.api.user.dto.request;

public record MailCheckRequestDto(
        String email,
        int userNumber) {
}
