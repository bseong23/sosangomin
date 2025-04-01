package com.ssafy.sosangomin.api.proxy.data.controller;

import com.ssafy.sosangomin.api.proxy.data.docs.DataSwagger;
import com.ssafy.sosangomin.api.proxy.data.service.DataProxyService;
import com.ssafy.sosangomin.common.annotation.DecryptedId;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@Slf4j
@RestController
@RequestMapping("/api/proxy/data")
@Tag(name = "데이터 관리 프록시 API", description = "FastAPI 데이터 관리 서비스를 위한 프록시 API")
@RequiredArgsConstructor
public class DataProxyController implements DataSwagger {

    private final DataProxyService dataProxyService;

    @GetMapping("/datasources")
    public ResponseEntity<Object> getDataSources(@DecryptedId @RequestParam(required = false) Long storeId) {
        log.info("Received data sources list request with store ID: {}", storeId);
        return dataProxyService.getDataSources(storeId).block();
    }

    @GetMapping("/datasources/{sourceId}")
    public ResponseEntity<Object> getDataSource(@PathVariable String sourceId) {
        log.info("Received data source request for ID: {}", sourceId);
        return dataProxyService.getDataSource(sourceId).block();
    }
}