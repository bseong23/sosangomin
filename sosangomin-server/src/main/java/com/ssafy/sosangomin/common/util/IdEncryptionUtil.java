package com.ssafy.sosangomin.common.util;

import com.ssafy.sosangomin.common.exception.ErrorMessage;
import com.ssafy.sosangomin.common.exception.InternalServerException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.nio.ByteBuffer;
import java.util.Base64;

@Slf4j
@Component
@RequiredArgsConstructor
public class IdEncryptionUtil {

    private static final String ALGORITHM = "AES";

    @Value("${encrypt.secret-key}")
    private String secretKey;

    public String encrypt(Long value) {
        try {
            SecretKeySpec secretKeySpec = new SecretKeySpec(secretKey.getBytes(), ALGORITHM);
            Cipher cipher = Cipher.getInstance(ALGORITHM);
            cipher.init(Cipher.ENCRYPT_MODE, secretKeySpec);
            byte[] valueBytes = ByteBuffer.allocate(Long.BYTES).putLong(value).array();
            byte[] encryptedData = cipher.doFinal(valueBytes);
            return Base64.getUrlEncoder().withoutPadding().encodeToString(encryptedData);
        } catch (Exception e) {
            log.error("ID ENCRYPTION ERROR", e);
            throw new InternalServerException(ErrorMessage.ERR_INTERNAL_SERVER_ENCRYPTION_ERROR);
        }
    }

    public Long decrypt(String encryptedData) {
        try {
            SecretKeySpec secretKeySpec = new SecretKeySpec(secretKey.getBytes(), ALGORITHM);
            Cipher cipher = Cipher.getInstance(ALGORITHM);
            cipher.init(Cipher.DECRYPT_MODE, secretKeySpec);
            byte[] decodedData = Base64.getUrlDecoder().decode(encryptedData);
            byte[] decryptedBytes = cipher.doFinal(decodedData);
            return ByteBuffer.wrap(decryptedBytes).getLong();
        } catch (Exception e) {
            log.error("ID DECRYPTION ERROR", e);
            throw new InternalServerException(ErrorMessage.ERR_INTERNAL_SERVER_DECRYPTION_ERROR);
        }
    }
}
