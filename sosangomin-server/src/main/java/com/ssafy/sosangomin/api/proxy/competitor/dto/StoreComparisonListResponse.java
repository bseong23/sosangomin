// StoreComparisonListResponse.java
package com.ssafy.sosangomin.api.proxy.competitor.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import java.util.Map;

public record StoreComparisonListResponse(
        @Schema(description = "비교 분석 목록")
        List<ComparisonItem> comparisons
) {
    public record ComparisonItem(
            @Schema(description = "분석 ID")
            String analysisId,

            @Schema(description = "경쟁사 이름")
            String competitorName,

            @Schema(description = "분석 일자")
            String analysisDate,

            @Schema(description = "요약 데이터")
            Map<String, Object> summaryData
    ) {}
}