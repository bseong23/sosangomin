package com.ssafy.sosangomin.api.proxy.data.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;

public record DataSource(
        @Schema(description = "데이터소스 ID", example = "6073a5c4d7f1e81a94d3b5c2")
        @JsonProperty("_id")
        String id,

        @Schema(description = "매장 ID", example = "1")
        @JsonProperty("store_id")
        Integer storeId,

        @Schema(description = "원본 파일명", example = "sales_data_2025_01.xlsx")
        @JsonProperty("original_filename")
        String originalFilename,

        @Schema(description = "파일 경로", example = "stores/1/data/sales_data_2025_01.xlsx")
        @JsonProperty("file_path")
        String filePath,

        @Schema(description = "업로드 날짜", example = "2025-01-15T12:30:45.123Z")
        @JsonProperty("upload_date")
        String uploadDate,

        @Schema(description = "마지막 분석 날짜", example = "2025-01-16T10:20:30.456Z")
        @JsonProperty("last_analyzed")
        String lastAnalyzed,

        @Schema(description = "상태", example = "active")
        String status,

        @Schema(description = "설명", example = "2025년 1월 판매 데이터")
        String description
) {}