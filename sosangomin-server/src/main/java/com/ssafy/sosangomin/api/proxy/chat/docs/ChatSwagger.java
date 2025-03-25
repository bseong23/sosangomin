package com.ssafy.sosangomin.api.proxy.chat.docs;

import com.ssafy.sosangomin.api.proxy.chat.controller.ChatProxyController.ChatRequest;
import com.ssafy.sosangomin.api.proxy.chat.controller.ChatProxyController.ChatResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.web.bind.annotation.RequestBody;
import reactor.core.publisher.Mono;

public interface ChatSwagger {

    @Operation(
            summary = "통합 챗봇 API",
            description = "사용자 메시지를 챗봇 서비스로 전달합니다"
    )
    @ApiResponses(
            value = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "챗봇 응답 성공",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = ChatResponse.class)
                            )
                    ),
                    @ApiResponse(
                            responseCode = "500",
                            description = "서버 오류"
                    ),
                    @ApiResponse(
                            responseCode = "404",
                            description = "찾을 수 없음"
                    )
            }
    )
    Mono<ChatResponse> chat(@RequestBody ChatRequest request);
}