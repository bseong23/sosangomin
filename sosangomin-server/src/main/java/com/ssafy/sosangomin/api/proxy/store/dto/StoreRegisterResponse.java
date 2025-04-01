package com.ssafy.sosangomin.api.proxy.store.dto;
import com.ssafy.sosangomin.api.proxy.store.entity.Store;
import io.swagger.v3.oas.annotations.media.Schema;
import com.fasterxml.jackson.annotation.JsonProperty;

public record StoreRegisterResponse(
        @Schema(description = "응답 상태", example = "success")
        String status,

        @Schema(description = "응답 메시지", example = "사업자등록번호가 검증되었으며, 매장이 성공적으로 등록되었습니다.")
        String message,

        @Schema(description = "매장 정보")
        Store store,

        @Schema(description = "사업자등록번호 검증 결과", example = "true")
        @JsonProperty("verification_result")
        Boolean verificationResult
) {}