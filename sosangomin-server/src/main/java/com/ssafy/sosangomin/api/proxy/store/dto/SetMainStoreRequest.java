package com.ssafy.sosangomin.api.proxy.store.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

public record SetMainStoreRequest(
        @Schema(description = "암호화된 매장 ID", example = "ABC123XYZ789", required = true)
        @NotBlank
        @JsonProperty("store_id")
        String storeId
) {}