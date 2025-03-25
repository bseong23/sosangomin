package com.ssafy.sosangomin.api.proxy.analysis.docs;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import reactor.core.publisher.Mono;
import com.ssafy.sosangomin.api.proxy.analysis.controller.AnalysisProxyController.CombinedAnalysisRequest;
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
                            content = @Content(mediaType = "application/json")
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
    Mono<ResponseEntity<Object>> analyzeCombinedData(@RequestBody CombinedAnalysisRequest request);

    @Operation(
            summary = "분석 결과 조회",
            description = "특정 분석 ID에 대한 결과를 조회합니다"
    )
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "조회 성공",
                            content = @Content(mediaType = "application/json")
                    ),
                    @ApiResponse(
                            responseCode = "404",
                            description = "분석 결과를 찾을 수 없음"
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
    Mono<ResponseEntity<Object>> getAnalysisResult(
            @Parameter(description = "분석 결과 ID") @PathVariable String analysisId);

    @Operation(
            summary = "최신 분석 결과 조회",
            description = "특정 데이터소스의 가장 최근 분석 결과를 조회합니다"
    )
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "조회 성공",
                            content = @Content(mediaType = "application/json")
                    ),
                    @ApiResponse(
                            responseCode = "404",
                            description = "분석 결과를 찾을 수 없음"
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
    Mono<ResponseEntity<Object>> getLatestAnalysisResult(
            @Parameter(description = "데이터소스 ID") @RequestParam String sourceId);
}