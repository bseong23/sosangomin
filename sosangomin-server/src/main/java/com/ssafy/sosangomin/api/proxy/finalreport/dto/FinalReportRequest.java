package com.ssafy.sosangomin.api.proxy.finalreport.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

public record FinalReportRequest(
        @Schema(description = "매장 ID", required = true, example = "abcd1234efghi")
        @NotNull
        @JsonProperty("store_id")
        String storeId
) {}