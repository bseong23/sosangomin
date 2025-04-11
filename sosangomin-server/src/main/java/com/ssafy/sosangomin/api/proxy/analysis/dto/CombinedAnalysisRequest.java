package com.ssafy.sosangomin.api.proxy.analysis.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record CombinedAnalysisRequest(
        @Schema(description = "매장 ID", required = true, example = "abcd1234efghi")
        @JsonProperty("store_id")
        String storeId,

        @Schema(description = "데이터소스 ID 목록", required = true, example = "[\"source_1\", \"source_2\"]")
        @NotNull
        @JsonProperty("source_ids")
        List<String> sourceIds,

        @Schema(description = "POS 시스템 유형", example = "키움", defaultValue = "키움")
        @JsonProperty("pos_type")
        String posType
) {
    public CombinedAnalysisRequest {
        posType = posType == null ? "키움" : posType;
    }
}