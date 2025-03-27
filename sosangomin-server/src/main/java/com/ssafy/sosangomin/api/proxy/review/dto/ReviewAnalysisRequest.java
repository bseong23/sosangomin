package com.ssafy.sosangomin.api.proxy.review.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

public record ReviewAnalysisRequest(
        @Schema(description = "매장 ID", required = true, example = "1")
        @NotNull
        @JsonProperty("store_id")
        int storeId,

        @Schema(description = "네이버 플레이스 ID", required = true, example = "1234567890")
        @NotNull
        @JsonProperty("place_id")
        String placeId
) {}