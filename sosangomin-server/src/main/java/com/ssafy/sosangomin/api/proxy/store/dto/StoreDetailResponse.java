package com.ssafy.sosangomin.api.proxy.store.dto;
import com.ssafy.sosangomin.api.proxy.store.entity.Store;
import io.swagger.v3.oas.annotations.media.Schema;
public record StoreDetailResponse(
        @Schema(description = "응답 상태", example = "success")
        String status,

        @Schema(description = "매장 정보")
        Store store
) {}