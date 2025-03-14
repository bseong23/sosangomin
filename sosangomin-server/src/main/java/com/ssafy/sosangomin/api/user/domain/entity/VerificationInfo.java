package com.ssafy.sosangomin.api.user.domain.entity;

import java.time.LocalDateTime;

// 인증 정보를 저장하는 내부 클래스
public class VerificationInfo {
    private final int number;
    private final LocalDateTime expiryTime;

    public VerificationInfo(int number, LocalDateTime expiryTime) {
        this.number = number;
        this.expiryTime = expiryTime;
    }

    public int getNumber() {
        return number;
    }

    public LocalDateTime getExpiryTime() {
        return expiryTime;
    }

    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expiryTime);
    }
}
