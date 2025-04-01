package com.ssafy.sosangomin.api.file.docs;

import com.ssafy.sosangomin.api.file.domain.dto.response.FileUploadResponseDto;
import com.ssafy.sosangomin.common.annotation.DecryptedId;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.util.List;

public interface FileSwagger {

    @Operation(
            summary = "분석 대상 파일 업로드",
            description = "분석 대상 파일을 업로드 합니다. 요청시 액세스 토큰이 필요합니다."
    )
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "분석 대상 파일 업로드 성공. 파일 objectId 반환",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = FileUploadResponseDto.class)
                            )
                    ),
                    @ApiResponse(
                            responseCode = "401",
                            description = "해당 점포 정보에 이 유저가 파일을 업로드할 권한 없음",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(
                                            type = "object",
                                            example = "{\n" +
                                                    "  \"status\": \"401\",\n" +
                                                    "  \"errorMessage\": \"ERR_USER_STORE_NOT_MATCH\"\n" +
                                                    "}"
                                    )
                            )
                    )
            }
    )
    ResponseEntity<?> uploadFiles(
            @RequestParam List<MultipartFile> files,
            @Parameter(name = "storeId", description = "암호화된 가게 id(pk)", schema = @Schema(type = "string"))
            @DecryptedId @RequestParam Long storeId,
            @Parameter(description = "시작 월 (YYYY-MM 형식)") @RequestParam String startMonth,
            @Parameter(description = "종료 월 (YYYY-MM 형식)") @RequestParam String endMonth,
            Principal principal
            );
}
