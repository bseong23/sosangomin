package com.ssafy.sosangomin.api.proxy.location.docs;

import com.ssafy.sosangomin.api.proxy.location.dto.LocationRecommendRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;

public interface LocationSwagger {

    @Operation(
            summary = "입지 추천 - 상위 행정동 목록",
            description = "업종, 타겟 연령대, 우선순위에 따라 추천 입지의 상위 N개 행정동을 제공합니다"
    )
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "추천 성공",
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
                                                    "  \"error\": \"유효하지 않은 입력값입니다\",\n" +
                                                    "  \"message\": \"ERR_INVALID_LOCATION_REQUEST\"\n" +
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
                                                    "  \"error\": \"입지 추천 중 오류가 발생했습니다\",\n" +
                                                    "  \"message\": \"ERR_LOCATION_PROCESSING_ERROR\"\n" +
                                                    "}"
                                    )
                            )
                    )
            }
    )
    ResponseEntity<Object> recommendLocation(@RequestBody LocationRecommendRequest request);

    @Operation(
            summary = "입지 추천 - 지도 데이터",
            description = "업종, 타겟 연령대, 우선순위에 따라 지도 시각화를 위한 모든 행정동 추천 데이터를 제공합니다"
    )
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "추천 성공",
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
                                                    "  \"error\": \"유효하지 않은 입력값입니다\",\n" +
                                                    "  \"message\": \"ERR_INVALID_LOCATION_REQUEST\"\n" +
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
                                                    "  \"error\": \"입지 추천 중 오류가 발생했습니다\",\n" +
                                                    "  \"message\": \"ERR_LOCATION_PROCESSING_ERROR\"\n" +
                                                    "}"
                                    )
                            )
                    )
            }
    )
    ResponseEntity<Object> recommendMapLocations(@RequestBody LocationRecommendRequest request);

    @Operation(
            summary = "초기 히트맵 데이터 조회",
            description = "지도 히트맵 시각화를 위한 초기 데이터를 제공합니다."
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
                            responseCode = "500",
                            description = "서버 오류",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(
                                            type = "object",
                                            example = "{\n" +
                                                    "  \"error\": \"히트맵 데이터 호출 중 오류가 발생했습니다\",\n" +
                                                    "  \"message\": \"ERR_HEATMAP_DATA_ERROR\"\n" +
                                                    "}"
                                    )
                            )
                    )
            }
    )
    ResponseEntity<Object> getHeatmapData();
}