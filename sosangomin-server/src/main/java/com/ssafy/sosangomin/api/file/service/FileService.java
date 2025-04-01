package com.ssafy.sosangomin.api.file.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.ssafy.sosangomin.api.file.domain.dto.response.FileUploadResponseDto;
import com.ssafy.sosangomin.api.file.domain.entity.DataSource;
import com.ssafy.sosangomin.api.file.mapper.FileMapper;
import com.ssafy.sosangomin.api.file.repository.FileMongoRepository;
import com.ssafy.sosangomin.common.exception.ErrorMessage;
import com.ssafy.sosangomin.common.exception.InternalServerException;
import com.ssafy.sosangomin.common.exception.UnAuthorizedException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FileService {

    private final FileMapper fileMapper;
    private final FileMongoRepository fileMongoRepository;
    private final AmazonS3 amazonS3;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    public FileUploadResponseDto uploadFile(List<MultipartFile> files,
                                            Long storeId,
                                            String startMonth,
                                            String endMonth,
                                            Long userId) {

        // 요청한 유저가 해당 점포에 대한 권한 없으면 예외 발생
        if (!userId.equals(fileMapper.findUserIdByStoreId(storeId))) {
            throw new UnAuthorizedException(ErrorMessage.ERR_USER_STORE_NOT_MATCH);
        }

        // 파일 업로드
        List<String> filePathList = new ArrayList<>();
        for (MultipartFile file : files) {
            filePathList.add(uploadS3AndReturnFilePath(file, storeId));
        }

        // 몽고 db에 파일 정보 업로드
        List<String> ObjectIdList = new ArrayList<>();

        for (int fileIdx = 0; fileIdx < files.size(); fileIdx++) {

            DataSource dataSource = DataSource.builder()
                    .storeId(storeId)
                    .sourceName(files.get(fileIdx).getOriginalFilename() + " (" + startMonth + "~" + endMonth + ")")
                    .originalFilename(files.get(fileIdx).getOriginalFilename())
                    .filePath(filePathList.get(fileIdx))
                    .fileSize(files.get(fileIdx).getSize())
                    .fileType(extractExt(files.get(fileIdx).getOriginalFilename()))
                    .contentType(files.get(fileIdx).getContentType())
                    .uploadDate(LocalDateTime.now())
                    .status("active")
                    .startMonth(startMonth)
                    .endMonth(endMonth)
                    .lastAccessed(LocalDateTime.now())
                    .build();

            DataSource savedDataSource = fileMongoRepository.save(dataSource);

            ObjectIdList.add(savedDataSource.getId());
        }

        return new FileUploadResponseDto(ObjectIdList);
    }

    private String uploadS3AndReturnFilePath(MultipartFile file, Long storeId) {
        String uniqueFileName = createFileName(file.getOriginalFilename());
        String filePath = "store/store_" + storeId + "/" + uniqueFileName;

        // 파일 메타데이터 설정
        ObjectMetadata objectMetadata = new ObjectMetadata();
        objectMetadata.setContentType(file.getContentType());
        objectMetadata.setContentLength(file.getSize());

        // S3에 파일 업로드
        try (InputStream inputStream = file.getInputStream()) {
            amazonS3.putObject(new PutObjectRequest(bucket, filePath, inputStream, objectMetadata)
                    .withCannedAcl(CannedAccessControlList.PublicRead));
        } catch (IOException e) {
            throw new InternalServerException(ErrorMessage.ERR_INTERNAL_SERVER_PROFILE_IMG_UPLOAD_FAIL_ERROR);
        }

        return filePath;
    }

    private String createFileName(String originalFileName) {
        // 파일 확장자 추출
        String ext = extractExt(originalFileName);

        // UUID를 사용하여 고유한 파일명 생성
        String uuid = UUID.randomUUID().toString();

        return uuid + "." + ext;
    }

    private String extractExt(String originalFileName) {
        int pos = originalFileName.lastIndexOf(".");
        return originalFileName.substring(pos + 1);
    }
}
