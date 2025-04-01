package com.ssafy.sosangomin.api.file.controller;

import com.ssafy.sosangomin.api.file.docs.FileSwagger;
import com.ssafy.sosangomin.api.file.service.FileService;
import com.ssafy.sosangomin.common.annotation.DecryptedId;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/file")
@RequiredArgsConstructor
public class FileController implements FileSwagger {

    private final FileService fileService;

    @PostMapping
    public ResponseEntity<?> uploadFiles(
            @RequestParam List<MultipartFile> files,
            @RequestParam @DecryptedId Long storeId,
            @RequestParam String startMonth,
            @RequestParam String endMonth,
            Principal principal) {
        Long userId = Long.parseLong(principal.getName());
        return ResponseEntity.ok().body(fileService.uploadFile(files, storeId, startMonth, endMonth, userId));
    }
}
