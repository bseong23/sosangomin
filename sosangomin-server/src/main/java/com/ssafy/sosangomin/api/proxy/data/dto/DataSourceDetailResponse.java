package com.ssafy.sosangomin.api.proxy.data.dto;

import com.ssafy.sosangomin.api.proxy.data.entity.DataSource;
import io.swagger.v3.oas.annotations.media.Schema;

public record DataSourceDetailResponse(
        @Schema(description = "응답 상태", example = "success")
        String status,

        @Schema(description = "데이터소스 정보")
        DataSource datasource
) {}