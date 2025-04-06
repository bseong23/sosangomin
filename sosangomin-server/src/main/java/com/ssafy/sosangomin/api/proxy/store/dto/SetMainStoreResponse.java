package com.ssafy.sosangomin.api.proxy.store.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;

public record SetMainStoreResponse(
        @Schema(description = "응답 상태", example = "success")
        String status,

        @Schema(description = "응답 메시지", example = "대표 가게가 성공적으로 변경되었습니다.")
        String message,

        @Schema(description = "매장 ID", example = "ABC123XYZ789")
        @JsonProperty("store_id")
        String storeId
) {}