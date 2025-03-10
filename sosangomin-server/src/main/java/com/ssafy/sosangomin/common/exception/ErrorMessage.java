package com.ssafy.sosangomin.common.exception;

import lombok.Getter;

@Getter
public enum ErrorMessage {

    /**
     * 400 Bad Request
     */
    ERR_INVALID_REQUEST_FIELD,
    ERR_INVALID_QUERY_PARAMETER,
    ERR_INVALID_MAIL_NUMBER,

    /**
     * 401 UNAUTHORIZED
     */
    ERR_INVALID_TOKEN,

    /**
     * /** 404 NOT_FOUND
     */
    ERR_NOT_RESOURCE,


    /**
     * 500 INTERNAL_SERVER_ERROR
     */
    ERR_INTERNAL_SERVER_ENCRYPTION_ERROR,
    ERR_INTERNAL_SERVER_DECRYPTION_ERROR,
    ERR_INTERNAL_SERVER_MAIL_SEND_FAIL_ERROR
}
