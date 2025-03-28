package com.ssafy.sosangomin.api.proxy.review.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.Map;

public record ReviewAnalysisResponse(
        @Schema(description = "분석 ID", example = "a1b2c3d4e5f6")
        @JsonProperty("analysis_id")
        String analysisId,

        @Schema(description = "매장 ID", example = "1")
        @JsonProperty("store_id")
        int storeId,

        @Schema(description = "매장 이름", example = "착한 명태 조리고")
        @JsonProperty("store_name")
        String storeName,

        @Schema(description = "분석 상태", example = "success")
        @JsonProperty("status")
        String status,

        @Schema(description = "리뷰 수", example = "120")
        @JsonProperty("review_count")
        int reviewCount,

        @Schema(description = "평균 평점", example = "4.5")
        @JsonProperty("average_rating")
        double averageRating,

        @Schema(description = "감성 분석 분포", implementation = Object.class)
        @JsonProperty("sentiment_distribution")
        Map<String, Object> sentimentDistribution,

        @Schema(description = "키워드 및 분석 인사이트", implementation = Object.class)
        @JsonProperty("insights")
        String insights,

        @Schema(description = "단어 클라우드 데이터", implementation = Object.class)
        @JsonProperty("word_cloud_data")
        Map<String, Object> wordCloudData,

        @Schema(description = "분석 완료 시간", example = "2025-03-28T12:30:45.000Z")
        @JsonProperty("completed_at")
        String completedAt,

        @Schema(description = "분석 생성 시간", example = "2025-03-28T12:25:10.000Z")
        @JsonProperty("created_at")
        String createdAt
) {}