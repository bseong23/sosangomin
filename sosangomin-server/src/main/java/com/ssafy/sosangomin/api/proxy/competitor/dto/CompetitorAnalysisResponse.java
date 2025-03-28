// CompetitorAnalysisResponse.java
package com.ssafy.sosangomin.api.proxy.competitor.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.Map;

public record CompetitorAnalysisResponse(
        @Schema(description = "응답 상태", example = "success")
        String status,

        @Schema(description = "응답 메시지", example = "경쟁사 리뷰 분석 및 비교 분석이 완료되었습니다.")
        String message,

        @Schema(description = "경쟁사 분석 결과")
        Map<String, Object> competitorAnalysis,

        @Schema(description = "비교 분석 결과")
        Map<String, Object> comparisonResult
) {}