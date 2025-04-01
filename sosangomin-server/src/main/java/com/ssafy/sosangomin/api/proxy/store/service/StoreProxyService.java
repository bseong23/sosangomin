package com.ssafy.sosangomin.api.proxy.store.service;

import com.ssafy.sosangomin.api.proxy.store.dto.StoreRegisterWithBusinessRequest;
import com.ssafy.sosangomin.common.exception.BadRequestException;
import com.ssafy.sosangomin.common.exception.ErrorMessage;
import com.ssafy.sosangomin.common.exception.InternalServerException;
import com.ssafy.sosangomin.common.exception.NotFoundException;
import com.ssafy.sosangomin.common.util.IdEncryptionUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class StoreProxyService {

    private final WebClient webClient;
    private final IdEncryptionUtil idEncryptionUtil;

    public Mono<Object> registerStoreWithBusiness(StoreRegisterWithBusinessRequest request, Long userId) {
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("user_id", userId);
        requestBody.put("store_name", request.storeName());
        requestBody.put("business_number", request.businessNumber());
        requestBody.put("pos_type", request.posType());
        requestBody.put("category", request.category());

        return webClient.post()
                .uri("/api/store/register-with-business")
                .bodyValue(requestBody)
                .retrieve()
                .onStatus(
                        status -> status.is4xxClientError() || status.is5xxServerError(),
                        response -> response.bodyToMono(String.class)
                                .flatMap(errorBody -> {
                                    log.error("Error from FastAPI register store: {}", errorBody);

                                    if (response.statusCode().value() == 422) {
                                        return Mono.error(new BadRequestException(ErrorMessage.ERR_BUSINESS_NUMBER_VERIFICATION_FAILED));
                                    } else if (response.statusCode().is4xxClientError()) {
                                        if (errorBody.contains("가게 이름은 최소 2글자")) {
                                            return Mono.error(new BadRequestException(ErrorMessage.ERR_INVALID_STORE_NAME));
                                        } else if (errorBody.contains("사업자등록번호는 10자리")) {
                                            return Mono.error(new BadRequestException(ErrorMessage.ERR_INVALID_BUSINESS_NUMBER));
                                        } else {
                                            return Mono.error(new BadRequestException(ErrorMessage.ERR_INVALID_REQUEST_FIELD));
                                        }
                                    } else {
                                        if (errorBody.contains("가게 등록 중 오류")) {
                                            return Mono.error(new InternalServerException(ErrorMessage.ERR_STORE_REGISTRATION_ERROR));
                                        } else {
                                            return Mono.error(new InternalServerException(ErrorMessage.ERR_INTERNAL_SERVER_DECRYPTION_ERROR));
                                        }
                                    }
                                })
                )
                .bodyToMono(Object.class)
                .map(response -> {
                    if (response instanceof Map) {
                        Map<String, Object> responseMap = (Map<String, Object>) response;

                        if (responseMap.containsKey("store_id")) {
                            Number storeIdNumber = (Number) responseMap.get("store_id");
                            String encryptedStoreId = idEncryptionUtil.encrypt(storeIdNumber.longValue());
                            responseMap.remove("store_id");
                            responseMap.put("store_id", encryptedStoreId);
                        }

                        if (responseMap.containsKey("store_info")) {
                            Map<String, Object> storeInfo = (Map<String, Object>) responseMap.get("store_info");
                            if (storeInfo.containsKey("store_id")) {
                                Number storeIdNumber = (Number) storeInfo.get("store_id");
                                String encryptedStoreId = idEncryptionUtil.encrypt(storeIdNumber.longValue());
                                storeInfo.remove("store_id");
                                storeInfo.put("store_id", encryptedStoreId);
                            }
                        }
                    }
                    return response;
                });
    }

    public Mono<Object> getStoreList(Long userId) {
        return webClient.get()
                .uri("/api/store/list/{userId}", userId)
                .retrieve()
                .onStatus(
                        status -> status.is4xxClientError() || status.is5xxServerError(),
                        response -> response.bodyToMono(String.class)
                                .flatMap(errorBody -> {
                                    log.error("Error from FastAPI get store list: {}", errorBody);

                                    if (response.statusCode().is4xxClientError()) {
                                        return Mono.error(new BadRequestException(ErrorMessage.ERR_INVALID_USER_ID));
                                    } else {
                                        if (errorBody.contains("가게 목록 조회 중 오류")) {
                                            return Mono.error(new InternalServerException(ErrorMessage.ERR_STORE_LIST_PROCESSING_ERROR));
                                        } else {
                                            return Mono.error(new InternalServerException(ErrorMessage.ERR_INTERNAL_SERVER_DECRYPTION_ERROR));
                                        }
                                    }
                                })
                )
                .bodyToMono(Object.class)
                .map(response -> {
                    if (response instanceof Map) {
                        Map<String, Object> responseMap = (Map<String, Object>) response;
                        if (responseMap.containsKey("stores")) {
                            Object storesObj = responseMap.get("stores");
                            if (storesObj instanceof Iterable) {
                                Iterable<Map<String, Object>> stores = (Iterable<Map<String, Object>>) storesObj;
                                for (Map<String, Object> store : stores) {
                                    if (store.containsKey("store_id")) {
                                        Number storeIdNumber = (Number) store.get("store_id");
                                        String encryptedStoreId = idEncryptionUtil.encrypt(storeIdNumber.longValue());
                                        store.remove("store_id");
                                        store.put("store_id", encryptedStoreId);
                                    }
                                }
                            }
                        }
                    }
                    return response;
                });
    }

    public Mono<Object> getStoreDetail(Long storeId) {
        return webClient.get()
                .uri("/api/store/detail/{storeId}", storeId)
                .retrieve()
                .onStatus(
                        status -> status.is4xxClientError() || status.is5xxServerError(),
                        response -> response.bodyToMono(String.class)
                                .flatMap(errorBody -> {
                                    log.error("Error from FastAPI get store detail: {}", errorBody);

                                    if (response.statusCode().value() == 404) {
                                        return Mono.error(new NotFoundException(ErrorMessage.ERR_STORE_NOT_FOUND));
                                    } else if (response.statusCode().is4xxClientError()) {
                                        return Mono.error(new BadRequestException(ErrorMessage.ERR_INVALID_STORE_ID));
                                    } else {
                                        if (errorBody.contains("가게 상세 정보 조회 중 오류")) {
                                            return Mono.error(new InternalServerException(ErrorMessage.ERR_STORE_DETAIL_PROCESSING_ERROR));
                                        } else {
                                            return Mono.error(new InternalServerException(ErrorMessage.ERR_INTERNAL_SERVER_DECRYPTION_ERROR));
                                        }
                                    }
                                })
                )
                .bodyToMono(Object.class)
                .map(response -> {
                    if (response instanceof Map) {
                        Map<String, Object> responseMap = (Map<String, Object>) response;
                        if (responseMap.containsKey("store")) {
                            Map<String, Object> storeMap = (Map<String, Object>) responseMap.get("store");
                            if (storeMap.containsKey("store_id")) {
                                Number storeIdNumber = (Number) storeMap.get("store_id");
                                String encryptedStoreId = idEncryptionUtil.encrypt(storeIdNumber.longValue());
                                storeMap.remove("store_id");
                                storeMap.put("store_id", encryptedStoreId);
                            }
                        }
                    }
                    return response;
                });
    }

    public Mono<Object> getAnalysisList(Long storeId) {
        return webClient.get()
                .uri("/api/store/analysis-list/{storeId}", storeId)
                .retrieve()
                .onStatus(
                        status -> status.is4xxClientError() || status.is5xxServerError(),
                        response -> response.bodyToMono(String.class)
                                .flatMap(errorBody -> {
                                    log.error("Error from FastAPI get analysis list: {}", errorBody);
                                    return Mono.error(new InternalServerException(ErrorMessage.ERR_INTERNAL_SERVER_COMMUNICATION));
                                })
                )
                .bodyToMono(Object.class);
    }
}