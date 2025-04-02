package com.ssafy.sosangomin.api.proxy.area.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

public record AreaAnalysisRequest(
        @Schema(description = "행정동명", required = true, example = "청운효자동")
        @NotNull
        @JsonProperty("region_name")
        String regionName,

        @Schema(description = "업종명", required = true, example = "한식음식점")
        @NotNull
        @JsonProperty("industry_name")
        String industryName
) {}