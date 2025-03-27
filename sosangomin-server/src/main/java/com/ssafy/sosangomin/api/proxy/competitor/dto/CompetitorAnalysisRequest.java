package com.ssafy.sosangomin.api.proxy.competitor.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import jakarta.validation.constraints.NotNull;

@Data
public class CompetitorAnalysisRequest {
    @NotNull
    @JsonProperty("store_id")
    private int storeId;

    @NotNull
    @JsonProperty("competitor_name")
    private String competitorName;
}