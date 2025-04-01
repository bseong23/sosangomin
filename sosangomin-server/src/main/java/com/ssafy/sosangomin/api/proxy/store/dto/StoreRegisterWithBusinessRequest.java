package com.ssafy.sosangomin.api.proxy.store.dto;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record StoreRegisterWithBusinessRequest(
        @Schema(description = "매장 이름", required = true, example = "소상공인 카페")
        @NotBlank
        @Size(min = 2)
        @JsonProperty("store_name")
        String storeName,

        @Schema(description = "사업자등록번호", required = true, example = "123-45-67890")
        @NotBlank
        @JsonProperty("business_number")
        String businessNumber,

        @Schema(description = "POS 시스템 유형", required = true, example = "키움")
        @NotBlank
        @JsonProperty("pos_type")
        String posType,

        @Schema(description = "음식적 카테고리", required = true, example = "한식음식점")
        @NotBlank
        @JsonProperty("category")
        String category
) {}