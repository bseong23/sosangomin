package com.ssafy.sosangomin.api.user.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.DeleteObjectRequest;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.ssafy.sosangomin.api.user.domain.dto.request.*;
import com.ssafy.sosangomin.api.user.domain.dto.response.UpdateProfileImgResponseDto;
import com.ssafy.sosangomin.api.user.domain.entity.User;
import com.ssafy.sosangomin.api.user.domain.dto.response.LoginResponseDto;
import com.ssafy.sosangomin.api.user.domain.dto.response.UserInfoResponseDto;
import com.ssafy.sosangomin.api.user.mapper.UserMapper;
import com.ssafy.sosangomin.common.exception.BadRequestException;
import com.ssafy.sosangomin.common.exception.ErrorMessage;
import com.ssafy.sosangomin.common.exception.InternalServerException;
import com.ssafy.sosangomin.common.util.IdEncryptionUtil;
import com.ssafy.sosangomin.common.util.JwtTokenUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenUtil jwtTokenUtil;
    private final IdEncryptionUtil idEncryptionUtil;
    private final AmazonS3 amazonS3;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    public UserInfoResponseDto getUserInfo(Long userId) {
        Optional<User> userOptional = userMapper.findUserById(userId);
        User user = userOptional.get();

        return new UserInfoResponseDto(
                user.getUserType(),
                user.getEmail(),
                user.getName(),
                user.getProfileImgUrl()
        );
    }

    public void signUp(SignUpRequestDto signUpRequestDto) {

        Optional<User> user = userMapper.findUserByEmail(signUpRequestDto.mail());

        if (user.isPresent()) {
            throw new BadRequestException(ErrorMessage.ERR_USER_DUPLICATE);
        }

        userMapper.signUpUser(
                signUpRequestDto.mail(),
                signUpRequestDto.name(),
                passwordEncoder.encode(signUpRequestDto.password()));
    }

    public void deleteUser(Long userId) {
        userMapper.deleteUser(userId);
    }

    public LoginResponseDto login(LoginRequestDto loginRequestDto) {

        Optional<User> userOptional = userMapper.findUserByEmail(loginRequestDto.mail());

        if (!userOptional.isPresent()) {
            throw new BadRequestException(ErrorMessage.ERR_LOGIN_FAILED);
        }

        User user = userOptional.get();

        // 비밀번호 검증
        if (!passwordEncoder.matches(loginRequestDto.password(), user.getPassword())) {
            throw new BadRequestException(ErrorMessage.ERR_LOGIN_FAILED);
        }

        // JWT 토큰 생성
        String accessToken = jwtTokenUtil.createWeekAccessToken(String.valueOf(user.getUserId()));

        // 암호화된 유저 id (pk)
        String encryptedUserId = idEncryptionUtil.encrypt(user.getUserId());

        return new LoginResponseDto(
                accessToken,
                user.getName(),
                user.getProfileImgUrl(),
                "false",
                encryptedUserId,
                user.getUserRole().toString()
        );
    }

    @Transactional
    public void updateName(UpdateNameRequestDto updateNameRequestDto, Long userId) {

        // 여기서 중복검사 한번 더 진행
        Optional<User> user = userMapper.findUserByName(updateNameRequestDto.name());

        if (user.isPresent()) {
            throw new BadRequestException(ErrorMessage.ERR_NAME_DUPLICATE);
        }

        // 중복 안되면 업데이트 진행
        userMapper.updateName(updateNameRequestDto.name(), userId);
    }

    public void updatePassword(UpdatePasswordRequestDto updatePasswordRequestDto, Long userId) {

        userMapper.updatePassword(
                passwordEncoder.encode(updatePasswordRequestDto.password()),
                userId
        );
    }

    @Transactional
    public UpdateProfileImgResponseDto updateProfileImg(MultipartFile multipartFile, Long userId) {
        // 기존 프로필 이미지 URL 조회
        Optional<User> userOptional = userMapper.findUserById(userId);
        User user = userOptional.get();
        String oldProfileImgUrl = user.getProfileImgUrl();

        // 기존 이미지가 있으면 삭제
        if (oldProfileImgUrl != null) {
            deleteOldProfileImage(oldProfileImgUrl);
        }

        // 파일명 충돌 방지를 위한 고유 파일명 생성
        String fileName = createFileName(multipartFile.getOriginalFilename());

        String filePath = "profile_image/" + fileName;

        // 파일 메타데이터 설정
        ObjectMetadata objectMetadata = new ObjectMetadata();
        objectMetadata.setContentType(multipartFile.getContentType());
        objectMetadata.setContentLength(multipartFile.getSize());

        // S3에 파일 업로드
        try (InputStream inputStream = multipartFile.getInputStream()) {
            amazonS3.putObject(new PutObjectRequest(bucket, filePath, inputStream, objectMetadata)
                    .withCannedAcl(CannedAccessControlList.PublicRead));
        } catch (IOException e) {
            throw new InternalServerException(ErrorMessage.ERR_INTERNAL_SERVER_PROFILE_IMG_UPLOAD_FAIL_ERROR);
        }

        // 업로드된 파일의 S3 URL 반환
        String newProfileImgUrl = amazonS3.getUrl(bucket, filePath).toString();

        userMapper.updateProfileImgUrl(newProfileImgUrl, userId);

        return new UpdateProfileImgResponseDto(newProfileImgUrl);
    }

    public void checkNameDuplication(NameDuplicateRequestDto nameDuplicateRequestDto) {
        Optional<User> user = userMapper.findUserByName(nameDuplicateRequestDto.name());

        if (user.isPresent()) {
            throw new BadRequestException(ErrorMessage.ERR_NAME_DUPLICATE);
        }
    }

    public void checkEmailDuplication(MailDuplicateRequestDto mailDuplicateRequestDto) {
        Optional<User> user = userMapper.findUserByEmail(mailDuplicateRequestDto.mail());

        if (user.isPresent()) {
            throw new BadRequestException(ErrorMessage.ERR_EMAIL_DUPLICATE);
        }
    }

    private String createFileName(String originalFileName) {
        // 파일 확장자 추출
        String ext = extractExt(originalFileName);

        // UUID를 사용하여 고유한 파일명 생성
        String uuid = UUID.randomUUID().toString();

        return uuid + "." + ext;
    }

    private void deleteOldProfileImage(String profileImgUrl) {
        try {
            // URL에서 S3 키(경로) 추출
            String key = extractKeyFromUrl(profileImgUrl);

            // 키가 존재하는지 확인 후 삭제
            if (amazonS3.doesObjectExist(bucket, key)) {
                amazonS3.deleteObject(new DeleteObjectRequest(bucket, key));
            }
        } catch (Exception e) {
            throw new InternalServerException(ErrorMessage.ERR_INTERNAL_SERVER_PROFILE_IMG_UPLOAD_FAIL_ERROR);
        }
    }

    private String extractKeyFromUrl(String url) {
        try {
            String bucketUrl = amazonS3.getUrl(bucket, "").toString();
            return url.substring(bucketUrl.length()); // 버킷 URL을 제외한 부분이 키
        } catch (Exception e) {
            throw new InternalServerException(ErrorMessage.ERR_INTERNAL_SERVER_PROFILE_IMG_UPLOAD_FAIL_ERROR);
        }
    }

    // 확장자
    private String extractExt(String originalFileName) {
        int pos = originalFileName.lastIndexOf(".");
        return originalFileName.substring(pos + 1);
    }
}
