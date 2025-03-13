package com.ssafy.sosangomin.api.news.domain.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

public record PageCountResponseDto(
        @Schema
        int pageCount
) {
}
