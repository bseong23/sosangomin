package com.ssafy.sosangomin.api.proxy.review.docs;

import com.ssafy.sosangomin.api.proxy.review.controller.ReviewProxyController.ReviewAnalysisRequest;
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
                            description = "분석 성공"
                    ),
                    @ApiResponse(
                            responseCode = "400",
                            description = "잘못된 요청"
                    ),
                    @ApiResponse(
                            responseCode = "500",
                            description = "서버 오류"
                    )
            }
    )
    Mono<ResponseEntity<Object>> analyzeStoreReviews(@RequestBody ReviewAnalysisRequest request);

    @Operation(
            summary = "매장 리뷰 분석 목록 조회",
            description = "매장 ID를 기반으로 해당 매장의 리뷰 분석 목록을 조회합니다"
    )
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "조회 성공"
                    ),
                    @ApiResponse(
                            responseCode = "400",
                            description = "잘못된 요청"
                    ),
                    @ApiResponse(
                            responseCode = "500",
                            description = "서버 오류"
                    )
            }
    )
    Mono<ResponseEntity<Object>> getStoreReviewsList(
            @Parameter(description = "매장 ID") @PathVariable int storeId);

    @Operation(
            summary = "리뷰 분석 결과 조회",
            description = "분석 결과 ID를 기반으로.분석 결과를 조회합니다"
    )
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "조회 성공"
                    ),
                    @ApiResponse(
                            responseCode = "404",
                            description = "분석 결과를 찾을 수 없음"
                    ),
                    @ApiResponse(
                            responseCode = "500",
                            description = "서버 오류"
                    )
            }
    )
    Mono<ResponseEntity<Object>> getReviewAnalysis(
            @Parameter(description = "분석 결과 ID") @PathVariable String analysisId);
}