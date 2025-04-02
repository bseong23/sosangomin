package com.ssafy.sosangomin.api.proxy.area.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.Map;

public record AreaAnalysisResponse(
        @Schema(description = "인구 분석 정보")
        @JsonProperty("인구분석")
        Map<String, Object> populationAnalysis,

        @Schema(description = "업종 분석 정보")
        @JsonProperty("업종분석")
        Map<String, Object> storeAnalysis,

        @Schema(description = "매출 분석 정보")
        @JsonProperty("매출분석")
        Map<String, Object> salesAnalysis
) {}
