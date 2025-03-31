package com.ssafy.sosangomin.api.proxy.review.docs;

import com.ssafy.sosangomin.api.proxy.review.dto.ReviewAnalysisRequest;
import com.ssafy.sosangomin.api.proxy.review.dto.ReviewAnalysisResponse;
import com.ssafy.sosangomin.api.proxy.review.dto.StoreReviewsListResponse;
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

public interface ReviewSwagger {

    @Operation(
            summary = "매장 리뷰 분석",
            description = "매장 ID와 place ID를 기반으로 리뷰를 분석합니다"
    )
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "분석 성공",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = ReviewAnalysisResponse.class)
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
                                                    "  \"error\": \"유효하지 않은 리뷰 분석 요청입니다\",\n" +
                                                    "  \"message\": \"ERR_INVALID_REVIEW_REQUEST\"\n" +
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
                                                    "  \"error\": \"리뷰 분석 중 오류가 발생했습니다\",\n" +
                                                    "  \"message\": \"ERR_REVIEW_ANALYSIS_PROCESSING_ERROR\"\n" +
                                                    "}"
                                    )
                            )
                    )
            }
    )
    ResponseEntity<Object> analyzeStoreReviews(@RequestBody ReviewAnalysisRequest request);

    @Operation(
            summary = "매장 리뷰 분석 목록 조회",
            description = "매장 ID를 기반으로 해당 매장의 리뷰 분석 목록을 조회합니다"
    )
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "조회 성공",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = StoreReviewsListResponse.class)
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
                                                    "  \"error\": \"매장 리뷰 분석 목록 조회 중 오류가 발생했습니다\",\n" +
                                                    "  \"message\": \"ERR_REVIEW_LIST_PROCESSING_ERROR\"\n" +
                                                    "}"
                                    )
                            )
                    )
            }
    )
    ResponseEntity<Object> getStoreReviewsList(
            @Parameter(description = "매장 ID") @PathVariable int storeId);

    @Operation(
            summary = "리뷰 분석 결과 조회",
            description = "분석 결과 ID를 기반으로 분석 결과를 조회합니다"
    )
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "조회 성공",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = ReviewAnalysisResponse.class)
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
                                                    "  \"error\": \"리뷰 분석 결과를 찾을 수 없습니다\",\n" +
                                                    "  \"message\": \"ERR_REVIEW_ANALYSIS_NOT_FOUND\"\n" +
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
                                                    "  \"error\": \"유효하지 않은 분석 ID입니다\",\n" +
                                                    "  \"message\": \"ERR_INVALID_ANALYSIS_ID\"\n" +
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
                                                    "  \"error\": \"분석 결과 조회 중 오류가 발생했습니다\",\n" +
                                                    "  \"message\": \"ERR_REVIEW_RESULT_PROCESSING_ERROR\"\n" +
                                                    "}"
                                    )
                            )
                    )
            }
    )
    ResponseEntity<Object> getReviewAnalysis(
            @Parameter(description = "분석 결과 ID") @PathVariable String analysisId);
}