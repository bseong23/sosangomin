package com.ssafy.sosangomin.api.proxy.review.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import jakarta.validation.constraints.NotNull;

@Data
public class ReviewAnalysisRequest {
    @NotNull
    @JsonProperty("store_id")
    private int storeId;

    @NotNull
    @JsonProperty("place_id")
    private String placeId;
}