package com.ssafy.sosangomin.api.proxy.analysis.docs;

import com.ssafy.sosangomin.api.proxy.analysis.dto.AnalysisResponse;
import com.ssafy.sosangomin.api.proxy.analysis.dto.CombinedAnalysisRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import reactor.core.publisher.Mono;

public interface AnalysisSwagger {

    @Operation(
            summary = "종합 데이터 분석",
            description = "EDA, 예측, 클러스터링을 포함한 종합 분석을 수행합니다"
    )
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "분석 성공",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = AnalysisResponse.class)
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
                            responseCode = "500",
                            description = "서버 오류",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(
                                            type = "object",
                                            example = "{\n" +
                                                    "  \"error\": \"종합 분석 중 오류가 발생했습니다\",\n" +
                                                    "  \"message\": \"ERR_ANALYSIS_PROCESSING_ERROR\"\n" +
                                                    "}"
                                    )
                            )
                    )
            }
    )
    ResponseEntity<Object> analyzeCombinedData(@RequestBody CombinedAnalysisRequest request);

    @Operation(
            summary = "분석 결과 조회",
            description = "특정 분석 ID에 대한 결과를 조회합니다"
    )
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "조회 성공",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = AnalysisResponse.class)
                            )
                    ),
                    @ApiResponse(
                            responseCode = "404",
                            description = "분석 결과를 찾을 수 없음",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(
                                            type = "object",
                                            example = "{\n" +
                                                    "  \"error\": \"분석 결과를 찾을 수 없습니다\",\n" +
                                                    "  \"message\": \"ERR_ANALYSIS_RESULT_NOT_FOUND\"\n" +
                                                    "}"
                                    )
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
                                                    "  \"error\": \"유효하지 않은 분석 결과 ID입니다\",\n" +
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
                                                    "  \"error\": \"EDA 결과 조회 중 오류가 발생했습니다\",\n" +
                                                    "  \"message\": \"ERR_ANALYSIS_PROCESSING_ERROR\"\n" +
                                                    "}"
                                    )
                            )
                    )
            }
    )
    ResponseEntity<Object> getAnalysisResult(
            @Parameter(description = "분석 결과 ID") @PathVariable String analysisId);

    @Operation(
            summary = "데이터소스별 분석 결과 목록 조회",
            description = "특정 데이터소스의 모든 분석 결과를 조회합니다"
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
                                                    "  \"error\": \"유효하지 않은 데이터소스 ID입니다\",\n" +
                                                    "  \"message\": \"ERR_INVALID_SOURCE_ID\"\n" +
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
                                                    "  \"error\": \"EDA 결과 목록 조회 중 오류가 발생했습니다\",\n" +
                                                    "  \"message\": \"ERR_ANALYSIS_RESULTS_LIST_ERROR\"\n" +
                                                    "}"
                                    )
                            )
                    )
            }
    )
    ResponseEntity<Object> getAnalysisResultsBySource(
            @Parameter(description = "데이터소스 ID") @RequestParam String sourceId);

    @Operation(
            summary = "최신 분석 결과 조회",
            description = "특정 데이터소스의 가장 최근 분석 결과를 조회합니다"
    )
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "조회 성공",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = AnalysisResponse.class)
                            )
                    ),
                    @ApiResponse(
                            responseCode = "404",
                            description = "분석 결과를 찾을 수 없음",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(
                                            type = "object",
                                            example = "{\n" +
                                                    "  \"error\": \"데이터소스에 대한 EDA 결과가 없습니다\",\n" +
                                                    "  \"message\": \"ERR_LATEST_RESULT_NOT_FOUND\"\n" +
                                                    "}"
                                    )
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
                            responseCode = "500",
                            description = "서버 오류",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(
                                            type = "object",
                                            example = "{\n" +
                                                    "  \"error\": \"최근 EDA 결과 조회 중 오류가 발생했습니다\",\n" +
                                                    "  \"message\": \"ERR_ANALYSIS_PROCESSING_ERROR\"\n" +
                                                    "}"
                                    )
                            )
                    )
            }
    )
    ResponseEntity<Object> getLatestAnalysisResult(
            @Parameter(description = "데이터소스 ID") @RequestParam String sourceId);
}