package com.ssafy.sosangomin.api.proxy.store.dto;

import io.swagger.v3.oas.annotations.media.Schema;

public record StoreAnalysisInfo(
        @Schema(description = "MongoDB ObjectId 형식의 분석 ID", example = "660a293a832ed20d02d6c45f")
        String analysisId,

        @Schema(description = "분석 생성 일시", example = "2025-03-30T14:22:00")
        String createdAt
) {}
