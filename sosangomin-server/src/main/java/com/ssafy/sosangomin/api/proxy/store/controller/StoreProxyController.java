package com.ssafy.sosangomin.api.proxy.store.controller;

import com.ssafy.sosangomin.api.proxy.store.docs.StoreSwagger;
import com.ssafy.sosangomin.api.proxy.store.dto.StoreRegisterWithBusinessRequest;
import com.ssafy.sosangomin.api.proxy.store.service.StoreProxyService;
import com.ssafy.sosangomin.common.annotation.DecryptedId;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@Slf4j
@RestController
@RequestMapping("/api/proxy/store")
@Tag(name = "매장 관리 프록시 API", description = "FastAPI 매장 관리 서비스를 위한 프록시 API")
@RequiredArgsConstructor
public class StoreProxyController implements StoreSwagger {

    private final StoreProxyService storeProxyService;

    @PostMapping("/register-with-business")
    public ResponseEntity<Object> registerStoreWithBusiness(@RequestBody StoreRegisterWithBusinessRequest request, Principal principal) {
        log.info("Received store registration request with business number: {}", request);

        Long userId = Long.parseLong(principal.getName());

        return storeProxyService.registerStoreWithBusiness(request, userId)
                .map(ResponseEntity::ok).block();
    }

    @GetMapping("/list")
    public ResponseEntity<Object> getStoreList(Principal principal) {
        Long userId = Long.parseLong(principal.getName());

        log.info("Received store list request for user ID: {}", userId);
        return storeProxyService.getStoreList(userId)
                .map(ResponseEntity::ok).block();
    }

    @GetMapping("/detail/{encryptedStoreId}")
    public ResponseEntity<Object> getStoreDetail(@DecryptedId @PathVariable Long encryptedStoreId) {
        log.info("Received store detail request for store ID: {}", encryptedStoreId);
        return storeProxyService.getStoreDetail(encryptedStoreId)
                .map(ResponseEntity::ok).block();
    }

    @GetMapping("/analysis-list/{encryptedStoreId}")
    public ResponseEntity<Object> getAnalysisList(@DecryptedId @PathVariable Long encryptedStoreId) {
        return storeProxyService.getAnalysisList(encryptedStoreId)
                .map(ResponseEntity::ok).block();
    }
}