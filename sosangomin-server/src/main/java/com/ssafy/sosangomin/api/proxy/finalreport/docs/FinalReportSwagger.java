package com.ssafy.sosangomin.api.proxy.finalreport.docs;

import com.ssafy.sosangomin.api.proxy.finalreport.dto.FinalReportRequest;
import com.ssafy.sosangomin.common.annotation.DecryptedId;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

public interface FinalReportSwagger {

    @Operation(
            summary = "매장의 모든 SWOT 분석 보고서 목록 조회",
            description = "특정 매장의 모든 SWOT 분석 보고서 목록을 최신순으로 조회합니다"
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
                                                    "  \"error\": \"보고서 목록 조회 중 오류가 발생했습니다\",\n" +
                                                    "  \"message\": \"ERR_REPORT_LIST_PROCESSING_ERROR\"\n" +
                                                    "}"
                                    )
                            )
                    )
            }
    )
    ResponseEntity<Object> getStoreReportsList(
            @DecryptedId
            @Parameter(description = "매장 ID", schema = @Schema(type = "string"))
            @PathVariable Long storeId
    );

    @Operation(
            summary = "특정 SWOT 분석 보고서 상세 조회",
            description = "보고서 ID로 SWOT 분석 보고서의 상세 내용을 조회합니다"
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
                            responseCode = "404",
                            description = "보고서를 찾을 수 없음",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(
                                            type = "object",
                                            example = "{\n" +
                                                    "  \"error\": \"보고서를 찾을 수 없습니다\",\n" +
                                                    "  \"message\": \"ERR_REPORT_NOT_FOUND\"\n" +
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
                                                    "  \"error\": \"유효하지 않은 보고서 ID입니다\",\n" +
                                                    "  \"message\": \"ERR_INVALID_REPORT_ID\"\n" +
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
                                                    "  \"error\": \"보고서 조회 중 오류가 발생했습니다\",\n" +
                                                    "  \"message\": \"ERR_REPORT_PROCESSING_ERROR\"\n" +
                                                    "}"
                                    )
                            )
                    )
            }
    )
    ResponseEntity<Object> getFinalReport(
            @Parameter(description = "보고서 ID", required = true)
            @PathVariable String reportId
    );

    @Operation(
            summary = "매장의 종합 SWOT 분석 보고서 생성",
            description = "모든 분석 데이터를 종합하여 AI로 SWOT 분석 보고서를 생성합니다"
    )
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "생성 성공",
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
                                                    "  \"error\": \"보고서 생성 중 오류가 발생했습니다\",\n" +
                                                    "  \"message\": \"ERR_REPORT_GENERATION_ERROR\"\n" +
                                                    "}"
                                    )
                            )
                    )
            }
    )
    ResponseEntity<Object> generateFinalReport(@RequestBody FinalReportRequest encryptedRequest);
}