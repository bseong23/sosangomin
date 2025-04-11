package com.ssafy.sosangomin.common.exception;

import org.springframework.http.HttpStatus;

public class BadRequestException extends SosangominException {
    public BadRequestException(ErrorMessage errorMessage) {
        super(HttpStatus.BAD_REQUEST, errorMessage);
    }
}
