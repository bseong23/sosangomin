package com.ssafy.sosangomin.api.proxy.location.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;
public record LocationRecommendRequest(
        @Schema(description = "창업 업종명", required = true, example = "한식음식점")
        @NotBlank
        @JsonProperty("industry_name")
        String industryName,

        @Schema(description = "타겟 연령대", required = true, example = "20")
        @NotBlank
        @JsonProperty("target_age")
        String targetAge,

        @Schema(description = "우선순위 리스트", required = true, example = "[\"타겟연령\", \"유동인구\", \"임대료\"]")
        @NotEmpty
        @JsonProperty("priority")
        List<String> priority,

        @Schema(description = "추천받을 상위 행정동 개수", required = false, example = "3", defaultValue = "3")
        @JsonProperty("top_n")
        Integer topN
) {
    public LocationRecommendRequest {
        if (topN == null) {
            topN = 3;
        }
    }
}
