package com.ssafy.sosangomin.api.proxy.area.docs;

import com.ssafy.sosangomin.api.proxy.area.dto.AreaAnalysisResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

public interface AreaAnalysisSwagger {

    @Operation(
            summary = "상권 분석 요약 정보 조회",
            description = "행정동과 업종을 기반으로 상권 분석 요약 정보를 조회합니다"
    )
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "분석 성공",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = AreaAnalysisResponse.class)
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
                                                    "  \"error\": \"유효하지 않은 상권 분석 요청입니다\",\n" +
                                                    "  \"message\": \"ERR_INVALID_AREA_REQUEST\"\n" +
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
                                                    "  \"error\": \"상권 분석 중 오류가 발생했습니다\",\n" +
                                                    "  \"message\": \"ERR_AREA_ANALYSIS_PROCESSING_ERROR\"\n" +
                                                    "}"
                                    )
                            )
                    )
            }
    )
    ResponseEntity<Object> getSummaryAnalysis(
            @Parameter(description = "행정동 이름", required = true)
            @RequestParam String regionName,
            @Parameter(description = "업종 이름", required = true)
            @RequestParam String industryName
    );

    @Operation(
            summary = "인구 분석 정보 조회",
            description = "행정동을 기반으로 인구 분석 정보를 조회합니다"
    )
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "조회 성공",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = Object.class)
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
                                                    "  \"error\": \"유효하지 않은 행정동명입니다\",\n" +
                                                    "  \"message\": \"ERR_INVALID_REGION_NAME\"\n" +
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
                                                    "  \"error\": \"인구 분석 중 오류가 발생했습니다\",\n" +
                                                    "  \"message\": \"ERR_POPULATION_ANALYSIS_PROCESSING_ERROR\"\n" +
                                                    "}"
                                    )
                            )
                    )
            }
    )
    ResponseEntity<Object> getPopulationAnalysis(
            @Parameter(description = "행정동 이름", required = true)
            @RequestParam String regionName
    );

    @Operation(
            summary = "업종 분석 정보 조회",
            description = "행정동과 업종을 기반으로 업종 분석 정보를 조회합니다"
    )
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "조회 성공",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = Object.class)
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
                                                    "  \"error\": \"유효하지 않은 요청 파라미터입니다\",\n" +
                                                    "  \"message\": \"ERR_INVALID_QUERY_PARAMETER\"\n" +
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
                                                    "  \"error\": \"업종 분석 중 오류가 발생했습니다\",\n" +
                                                    "  \"message\": \"ERR_STORE_ANALYSIS_PROCESSING_ERROR\"\n" +
                                                    "}"
                                    )
                            )
                    )
            }
    )
    ResponseEntity<Object> getCategoryAnalysis(
            @Parameter(description = "행정동 이름", required = true)
            @RequestParam String regionName,
            @Parameter(description = "업종 이름", required = true)
            @RequestParam String industryName
    );

    @Operation(
            summary = "매출 분석 정보 조회",
            description = "행정동과 업종을 기반으로 매출 분석 정보를 조회합니다"
    )
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "조회 성공",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = Object.class)
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
                                                    "  \"error\": \"유효하지 않은 요청 파라미터입니다\",\n" +
                                                    "  \"message\": \"ERR_INVALID_QUERY_PARAMETER\"\n" +
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
                                                    "  \"error\": \"매출 분석 중 오류가 발생했습니다\",\n" +
                                                    "  \"message\": \"ERR_SALES_ANALYSIS_PROCESSING_ERROR\"\n" +
                                                    "}"
                                    )
                            )
                    )
            }
    )
    ResponseEntity<Object> getSalesAnalysis(
            @Parameter(description = "행정동 이름", required = true)
            @RequestParam String regionName,
            @Parameter(description = "업종 이름", required = true)
            @RequestParam String industryName
    );
}