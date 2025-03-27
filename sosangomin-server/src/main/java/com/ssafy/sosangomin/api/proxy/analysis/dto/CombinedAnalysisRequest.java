package com.ssafy.sosangomin.api.proxy.analysis.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record CombinedAnalysisRequest(
        @NotNull
        @JsonProperty("store_id")
        int storeId,

        @NotNull
        @JsonProperty("source_ids")
        List<String> sourceIds,

        @JsonProperty("pos_type")
        String posType
) {
    public CombinedAnalysisRequest {
        posType = posType == null ? "키움" : posType;
    }
}