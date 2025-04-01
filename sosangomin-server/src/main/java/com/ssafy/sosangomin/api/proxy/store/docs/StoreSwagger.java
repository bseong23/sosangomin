package com.ssafy.sosangomin.api.proxy.store.docs;
import com.ssafy.sosangomin.api.proxy.store.dto.StoreDetailResponse;
import com.ssafy.sosangomin.api.proxy.store.dto.StoreListResponse;
import com.ssafy.sosangomin.api.proxy.store.dto.StoreRegisterResponse;
import com.ssafy.sosangomin.api.proxy.store.dto.StoreRegisterWithBusinessRequest;
import com.ssafy.sosangomin.api.proxy.store.dto.StoreAnalysisListResponse;
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

import java.security.Principal;

public interface StoreSwagger {

    @Operation(
            summary = "매장 등록 (사업자번호 검증)",
            description = "사업자등록번호를 검증하고 매장을 등록합니다. 액세스 토큰이 필요합니다."
    )
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "등록 성공",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = StoreRegisterResponse.class)
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
                                                    "  \"error\": \"사업자등록번호는 10자리 숫자여야 합니다\",\n" +
                                                    "  \"message\": \"ERR_INVALID_BUSINESS_NUMBER\"\n" +
                                                    "}"
                                    )
                            )
                    ),
                    @ApiResponse(
                            responseCode = "422",
                            description = "사업자번호 검증 실패",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(
                                            type = "object",
                                            example = "{\n" +
                                                    "  \"error\": \"사업자등록번호 검증에 실패했습니다\",\n" +
                                                    "  \"message\": \"ERR_BUSINESS_NUMBER_VERIFICATION_FAILED\"\n" +
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
                                                    "  \"error\": \"가게 등록 중 오류가 발생했습니다\",\n" +
                                                    "  \"message\": \"ERR_STORE_REGISTRATION_ERROR\"\n" +
                                                    "}"
                                    )
                            )
                    )
            }
    )
    ResponseEntity<Object> registerStoreWithBusiness(@RequestBody StoreRegisterWithBusinessRequest request, Principal principal);

    @Operation(
            summary = "사용자 매장 목록 조회",
            description = "JWT 토큰에서 추출한 사용자 ID를 기반으로 모든 매장 목록을 조회합니다. 액세스 토큰이 필요합니다."
    )
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "조회 성공",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = StoreListResponse.class)
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
                                                    "  \"error\": \"유효하지 않은 사용자 ID입니다\",\n" +
                                                    "  \"message\": \"ERR_INVALID_USER_ID\"\n" +
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
                                                    "  \"error\": \"가게 목록 조회 중 오류가 발생했습니다\",\n" +
                                                    "  \"message\": \"ERR_STORE_LIST_PROCESSING_ERROR\"\n" +
                                                    "}"
                                    )
                            )
                    )
            }
    )
    ResponseEntity<Object> getStoreList(Principal principal);

    @Operation(
            summary = "매장 상세 정보 조회",
            description = "암호화된 매장 ID를 기반으로 특정 매장의 상세 정보를 조회합니다."
    )
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "조회 성공",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = StoreDetailResponse.class)
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
                            responseCode = "404",
                            description = "매장을 찾을 수 없음",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(
                                            type = "object",
                                            example = "{\n" +
                                                    "  \"error\": \"해당 ID의 가게를 찾을 수 없습니다\",\n" +
                                                    "  \"message\": \"ERR_STORE_NOT_FOUND\"\n" +
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
                                                    "  \"error\": \"가게 상세 정보 조회 중 오류가 발생했습니다\",\n" +
                                                    "  \"message\": \"ERR_STORE_DETAIL_PROCESSING_ERROR\"\n" +
                                                    "}"
                                    )
                            )
                    )
            }
    )
    ResponseEntity<Object> getStoreDetail(@DecryptedId @PathVariable Long encryptedStoreId);

    @Operation(
            summary = "매장 분석 목록 조회",
            description = "암호화된 매장 ID를 기반으로 해당 매장의 분석 결과 목록을 조회합니다. 분석 결과에는 분석 ID와 생성일 정보가 포함됩니다."
    )
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "조회 성공",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(
                                            implementation = StoreAnalysisListResponse.class
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
                                                    "  \"error\": \"분석 결과 목록 조회 중 오류가 발생했습니다\",\n" +
                                                    "  \"message\": \"ERR_ANALYSIS_LIST_ERROR\"\n" +
                                                    "}"
                                    )
                            )
                    )
            }
    )
    ResponseEntity<Object> getAnalysisList(@DecryptedId @PathVariable Long encryptedStoreId);

}