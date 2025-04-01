package com.ssafy.sosangomin.api.proxy.store.dto;
import io.swagger.v3.oas.annotations.media.Schema;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;
public record Store(
        @Schema(description = "암호화된 매장 ID", example = "ABC123XYZ789")
        @JsonProperty("encrypted_store_id")
        String encryptedStoreId,

        @Schema(description = "사용자 ID", example = "1")
        @JsonProperty("user_id")
        Integer userId,

        @Schema(description = "매장 이름", example = "소상공인 카페")
        @JsonProperty("store_name")
        String storeName,

        @Schema(description = "주소", example = "서울특별시 강남구 테헤란로 212")
        String address,

        @Schema(description = "네이버 플레이스 ID", example = "1234567890")
        @JsonProperty("place_id")
        String placeId,

        @Schema(description = "카테고리", example = "카페")
        String category,

        @Schema(description = "리뷰 수", example = "42")
        @JsonProperty("review_count")
        Integer reviewCount,

        @Schema(description = "위도", example = "37.5012")
        Double latitude,

        @Schema(description = "경도", example = "127.0396")
        Double longitude,

        @Schema(description = "사업자등록번호", example = "123-45-67890")
        @JsonProperty("business_number")
        String businessNumber,

        @Schema(description = "검증 여부", example = "true")
        @JsonProperty("is_verified")
        Boolean isVerified,

        @Schema(description = "POS 시스템 유형", example = "키움")
        @JsonProperty("pos_type")
        String posType,

        @Schema(description = "생성 시간", example = "2025-03-15T09:30:00")
        @JsonProperty("created_at")
        String createdAt,

        @Schema(description = "업데이트 시간", example = "2025-03-16T14:20:00")
        @JsonProperty("updated_at")
        String updatedAt
) {}