package com.ssafy.sosangomin.api.proxy.competitor.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.Map;

public record ComparisonResultResponse(
        @Schema(description = "응답 상태", example = "success")
        @JsonProperty("status")
        String status,

        @Schema(description = "응답 메시지", example = "비교 분석 결과 조회가 성공적으로 완료되었습니다.")
        @JsonProperty("message")
        String message,

        @Schema(description = "비교 분석 결과 ID", example = "a1b2c3d4e5f6")
        @JsonProperty("comparison_id")
        String comparisonId,

        @Schema(description = "매장 ID", example = "1")
        @JsonProperty("store_id")
        Integer storeId,

        @Schema(description = "경쟁사 정보", implementation = Object.class)
        @JsonProperty("competitor_info")
        Map<String, Object> competitorInfo,

        @Schema(description = "내 매장 리뷰 분석 결과", implementation = Object.class)
        @JsonProperty("my_store_analysis")
        Map<String, Object> myStoreAnalysis,

        @Schema(description = "경쟁사 리뷰 분석 결과", implementation = Object.class)
        @JsonProperty("competitor_analysis")
        Map<String, Object> competitorAnalysis,

        @Schema(description = "비교 분석 결과", implementation = Object.class)
        @JsonProperty("comparison_data")
        Map<String, Object> comparisonData,

        @Schema(description = "생성 시간", example = "2025-03-28T12:34:56")
        @JsonProperty("created_at")
        String createdAt
) {}