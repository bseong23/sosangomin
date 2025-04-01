package com.ssafy.sosangomin.api.file.domain.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

public record FileUploadResponseDto(
        @Schema(description = "업로드한 파일들의 Object id")
        List<String> ObjectIdList
) {
}
