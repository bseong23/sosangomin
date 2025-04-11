package com.ssafy.sosangomin.api.proxy.data.docs;

import com.ssafy.sosangomin.api.proxy.data.dto.DataSourceDetailResponse;
import com.ssafy.sosangomin.api.proxy.data.dto.DataSourcesResponse;
import com.ssafy.sosangomin.common.annotation.DecryptedId;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import reactor.core.publisher.Mono;

public interface DataSwagger {

    @Operation(
            summary = "데이터소스 목록 조회",
            description = "등록된 데이터소스 목록을 조회합니다. 매장 ID를 제공하면 해당 매장의 데이터소스만 조회합니다."
    )
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "조회 성공",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = DataSourcesResponse.class)
                            )
                    ),
                    @ApiResponse(
                            responseCode = "400",
                            description = "잘못된 요청",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(
                                            type = "object",
                                            example = "{\n" +
                                                    "  \"error\": \"유효하지 않은 매장 ID입니다\",\n" +
                                                    "  \"message\": \"ERR_INVALID_STORE_ID\"\n" +
                                                    "}"
                                    )
                            )
                    ),
                    @ApiResponse(
                            responseCode = "500",
                            description = "서버 오류",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(
                                            type = "object",
                                            example = "{\n" +
                                                    "  \"error\": \"데이터소스 목록 조회 중 오류가 발생했습니다\",\n" +
                                                    "  \"message\": \"ERR_DATASOURCE_LIST_PROCESSING_ERROR\"\n" +
                                                    "}"
                                    )
                            )
                    )
            }
    )
    ResponseEntity<Object> getDataSources(
            @DecryptedId
            @Parameter(description = "매장 ID (필터링용)", schema = @Schema(type = "string"))
            @RequestParam(required = false)
            Long storeId);

    @Operation(
            summary = "데이터소스 상세 조회",
            description = "특정 데이터소스의 상세 정보를 조회합니다"
    )
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "조회 성공",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = DataSourceDetailResponse.class)
                            )
                    ),
                    @ApiResponse(
                            responseCode = "400",
                            description = "잘못된 요청",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(
                                            type = "object",
                                            example = "{\n" +
                                                    "  \"error\": \"유효하지 않은 데이터소스 ID입니다\",\n" +
                                                    "  \"message\": \"ERR_INVALID_SOURCE_ID\"\n" +
                                                    "}"
                                    )
                            )
                    ),
                    @ApiResponse(
                            responseCode = "404",
                            description = "데이터소스를 찾을 수 없음",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(
                                            type = "object",
                                            example = "{\n" +
                                                    "  \"error\": \"데이터소스를 찾을 수 없습니다\",\n" +
                                                    "  \"message\": \"ERR_DATASOURCE_NOT_FOUND\"\n" +
                                                    "}"
                                    )
                            )
                    ),
                    @ApiResponse(
                            responseCode = "500",
                            description = "서버 오류",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(
                                            type = "object",
                                            example = "{\n" +
                                                    "  \"error\": \"데이터소스 조회 중 오류가 발생했습니다\",\n" +
                                                    "  \"message\": \"ERR_DATASOURCE_PROCESSING_ERROR\"\n" +
                                                    "}"
                                    )
                            )
                    )
            }
    )
    ResponseEntity<Object> getDataSource(
            @Parameter(description = "데이터소스 ID") @PathVariable String sourceId);
}