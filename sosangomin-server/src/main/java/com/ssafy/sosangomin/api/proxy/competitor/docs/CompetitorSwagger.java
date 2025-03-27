package com.ssafy.sosangomin.api.proxy.competitor.docs;

import com.ssafy.sosangomin.api.proxy.competitor.dto.CompetitorAnalysisRequest;
import com.ssafy.sosangomin.api.proxy.competitor.dto.CompetitorAnalysisResponse;
import com.ssafy.sosangomin.api.proxy.competitor.dto.StoreComparisonListResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import reactor.core.publisher.Mono;

public interface CompetitorSwagger {

    @Operation(
            summary = "매장 비교 분석 목록 조회",
            description = "매장 ID를 기반으로 해당 매장의 경쟁사 비교 분석 목록을 조회합니다"
    )
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "조회 성공",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = StoreComparisonListResponse.class)
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
                                                    "  \"error\": \"매장 비교 분석 목록 조회 중 오류가 발생했습니다\",\n" +
                                                    "  \"message\": \"ERR_NOT_RESOURCE\"\n" +
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
                                                    "  \"error\": \"경쟁사 비교 분석 목록 조회 중 오류가 발생했습니다\",\n" +
                                                    "  \"message\": \"내부 서버 오류\"\n" +
                                                    "}"
                                    )
                            )
                    )
            }
    )
    Mono<ResponseEntity<Object>> getStoreComparisonList(
            @Parameter(description = "매장 ID") @PathVariable int storeId);

    @Operation(
            summary = "원클릭 경쟁사 분석",
            description = "경쟁사 이름으로 검색하여 리뷰 분석 및 내 매장과 비교까지 한 번에 수행합니다"
    )
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "분석 성공",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = CompetitorAnalysisResponse.class)
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
                                                    "  \"error\": \"경쟁사 분석 중 오류가 발생했습니다\",\n" +
                                                    "  \"message\": \"경쟁사 정보를 찾을 수 없습니다\"\n" +
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
                                                    "  \"error\": \"경쟁사 분석 중 오류가 발생했습니다\",\n" +
                                                    "  \"message\": \"ERR_INTERNAL_SERVER_ENCRYPTION_ERROR\"\n" +
                                                    "}"
                                    )
                            )
                    )
            }
    )
    Mono<ResponseEntity<Object>> oneClickAnalyzeCompetitor(@RequestBody CompetitorAnalysisRequest request);
}