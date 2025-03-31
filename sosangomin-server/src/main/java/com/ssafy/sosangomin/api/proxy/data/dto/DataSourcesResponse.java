package com.ssafy.sosangomin.api.proxy.data.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;

public record DataSourcesResponse(
        @Schema(description = "응답 상태", example = "success")
        String status,

        @Schema(description = "데이터소스 개수", example = "10")
        Integer count,

        @Schema(description = "데이터소스 목록")
        List<DataSource> datasources
) {}