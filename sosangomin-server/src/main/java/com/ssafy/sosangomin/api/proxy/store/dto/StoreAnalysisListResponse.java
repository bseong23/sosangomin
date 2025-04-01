package com.ssafy.sosangomin.api.proxy.store.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;

public record StoreAnalysisListResponse(
        @Schema(description = "응답 상태", example = "success")
        String status,

        @Schema(description = "분석 결과 개수", example = "2")
        Integer count,

        @Schema(description = "분석 결과 목록")
        List<StoreAnalysisInfo> analysisList
) {}
