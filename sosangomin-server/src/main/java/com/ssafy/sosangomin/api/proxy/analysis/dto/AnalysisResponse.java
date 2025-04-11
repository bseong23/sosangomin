package com.ssafy.sosangomin.api.proxy.analysis.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.Map;

public record AnalysisResponse(
        @Schema(description = "분석 ID", example = "a1b2c3d4-e5f6-7890-abcd-ef1234567890")
        @JsonProperty("analysis_id")
        String analysisId,

        @Schema(description = "매장 ID", example = "1")
        @JsonProperty("store_id")
        Integer storeId,

        @Schema(description = "분석 상태", example = "success")
        @JsonProperty("status")
        String status,

        @Schema(description = "분석 유형", example = "combined_analysis")
        @JsonProperty("analysis_type")
        String analysisType,

        @Schema(description = "생성 시간", example = "2025-03-27T10:30:15.123Z")
        @JsonProperty("created_at")
        String createdAt,

        @Schema(description = "완료 시간", example = "2025-03-27T10:35:42.456Z")
        @JsonProperty("completed_at")
        String completedAt,

        @Schema(description = "분석 데이터", implementation = Object.class)
        @JsonProperty("data")
        Map<String, Object> data,

        @Schema(description = "EDA 분석 결과", implementation = Object.class)
        @JsonProperty("eda_result")
        Map<String, Object> edaResult,

        @Schema(description = "자동 분석 결과", implementation = Object.class)
        @JsonProperty("auto_analysis_results")
        Map<String, Object> autoAnalysisResults,

        @Schema(description = "분석 요약", implementation = Object.class)
        @JsonProperty("summaries")
        Map<String, Object> summaries
) {}