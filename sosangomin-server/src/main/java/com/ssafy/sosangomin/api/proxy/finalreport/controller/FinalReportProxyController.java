package com.ssafy.sosangomin.api.proxy.finalreport.controller;

import com.ssafy.sosangomin.api.proxy.finalreport.docs.FinalReportSwagger;
import com.ssafy.sosangomin.api.proxy.finalreport.dto.FinalReportRequest;
import com.ssafy.sosangomin.api.proxy.finalreport.service.FinalReportProxyService;
import com.ssafy.sosangomin.common.annotation.DecryptedId;
import com.ssafy.sosangomin.common.util.IdEncryptionUtil;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/proxy/final-reports")
@Tag(name = "종합 SWOT 분석 보고서 프록시 API", description = "FastAPI 종합 SWOT 분석 보고서 서비스를 위한 프록시 API")
@RequiredArgsConstructor
public class FinalReportProxyController implements FinalReportSwagger {

    private final FinalReportProxyService finalReportProxyService;
    private final IdEncryptionUtil idEncryptionUtil;

    @GetMapping("/list/{storeId}")
    public ResponseEntity<Object> getStoreReportsList(@DecryptedId @PathVariable Long storeId) {
        log.info("Received store reports list request for store ID: {}", storeId);
        return finalReportProxyService.getStoreReportsList(storeId).block();
    }

    @GetMapping("/{reportId}")
    public ResponseEntity<Object> getFinalReport(@PathVariable String reportId) {
        log.info("Received final report request for report ID: {}", reportId);
        return finalReportProxyService.getFinalReport(reportId).block();
    }

    @PostMapping
    public ResponseEntity<Object> generateFinalReport(@RequestBody FinalReportRequest encryptedRequest) {
        log.info("Received final report generation request with encrypted store_id: {}", encryptedRequest);

        Long decryptedStoreId = idEncryptionUtil.decrypt(encryptedRequest.storeId());

        FinalReportRequest decryptedRequest = new FinalReportRequest(
                String.valueOf(decryptedStoreId)
        );

        log.info("Decrypted store_id for final report generation: {}", decryptedStoreId);

        return finalReportProxyService.generateFinalReport(decryptedRequest).block();
    }
}
