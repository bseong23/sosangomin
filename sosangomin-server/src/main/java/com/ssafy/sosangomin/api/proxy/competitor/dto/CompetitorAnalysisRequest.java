// CompetitorAnalysisRequest.java
package com.ssafy.sosangomin.api.proxy.competitor.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;

import jakarta.validation.constraints.NotNull;

public record CompetitorAnalysisRequest(
        @Schema(description = "매장 ID", required = true)
        @NotNull
        @JsonProperty("store_id")
        String storeId,

        @Schema(description = "경쟁사 이름", required = true)
        @NotNull
        @JsonProperty("competitor_name")
        String competitorName
) {}