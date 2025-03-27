package com.ssafy.sosangomin.api.proxy.review.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

public record StoreReviewsListResponse(
        @Schema(description = "매장 ID", example = "1")
        @JsonProperty("store_id")
        int storeId,

        @Schema(description = "매장 이름", example = "카페 브라운")
        @JsonProperty("store_name")
        String storeName,

        @Schema(description = "총 분석 결과 수", example = "5")
        @JsonProperty("total_count")
        int totalCount,

        @Schema(description = "분석 결과 목록")
        @JsonProperty("reviews_analyses")
        List<ReviewAnalysisSummary> reviewsAnalyses
) {
    public record ReviewAnalysisSummary(
            @Schema(description = "분석 ID", example = "a1b2c3d4e5f6")
            @JsonProperty("analysis_id")
            String analysisId,

            @Schema(description = "분석 상태", example = "success")
            @JsonProperty("status")
            String status,

            @Schema(description = "리뷰 수", example = "120")
            @JsonProperty("review_count")
            int reviewCount,

            @Schema(description = "평균 평점", example = "4.5")
            @JsonProperty("average_rating")
            double averageRating,

            @Schema(description = "긍정 리뷰 비율", example = "83.5")
            @JsonProperty("positive_percentage")
            double positivePercentage,

            @Schema(description = "주요 키워드", example = "맛있는, 친절한, 분위기 좋은")
            @JsonProperty("top_keywords")
            String topKeywords,

            @Schema(description = "분석 생성 시간", example = "2025-03-28T12:25:10.000Z")
            @JsonProperty("created_at")
            String createdAt
    ) {}
}