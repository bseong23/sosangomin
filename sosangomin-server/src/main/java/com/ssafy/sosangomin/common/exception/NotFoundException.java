package com.ssafy.sosangomin.common.exception;

import org.springframework.http.HttpStatus;

public class NotFoundException extends SosangominException {
    public NotFoundException(ErrorMessage errorMessage) {
        super(HttpStatus.NOT_FOUND, errorMessage);
    }
}
