package com.ssafy.sosangomin.api.news.docs;

import com.ssafy.sosangomin.api.news.domain.dto.response.NewsResponseDto;
import com.ssafy.sosangomin.api.news.domain.dto.response.PageCountResponseDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

public interface NewsSwagger {

    @Operation(
            summary = "뉴스 리스트 반환",
            description = "카테고리별 뉴스 리스트 반환"
    )
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "뉴스 리스트 반환 성공",
                            content = @Content(
                                    mediaType = "application/json",
                                    array = @ArraySchema(schema = @Schema(implementation = NewsResponseDto.class))
                            )
                    )
            }
    )
    ResponseEntity<List<NewsResponseDto>> getNews(
            @PathVariable int pageNum,
            @Parameter(
                    description = "카테고리 종류 (all, 지원정책, 창업정보, 경영관리, 시장동향, 플랫폼, 기타)"
            )
            @RequestParam String category
    );

    @Operation(
            summary = "뉴스 페이지 수 반환",
            description = "카테고리별 뉴스 페이지 수 반환"
    )
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "뉴스 페이지 수 반환 성공",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = PageCountResponseDto.class)
                            )
                    )
            }
    )
    ResponseEntity<PageCountResponseDto> getPageCount(
            @Parameter(
                    description = "카테고리 종류 (all, 지원정책, 창업정보, 경영관리, 시장동향, 플랫폼, 기타)"
            )
            @RequestParam String category
    );
}
