package com.ssafy.sosangomin.api.proxy.store.dto;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
public record StoreListResponse(
        @Schema(description = "응답 상태", example = "success")
        String status,

        @Schema(description = "매장 개수", example = "3")
        Integer count,

        @Schema(description = "매장 목록")
        List<Store> stores
) {}