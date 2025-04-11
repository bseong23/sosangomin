package com.ssafy.sosangomin.common.entity;

import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public abstract class BaseTimeEntity {

    protected LocalDateTime createdAt;

    protected LocalDateTime updatedAt;
}
