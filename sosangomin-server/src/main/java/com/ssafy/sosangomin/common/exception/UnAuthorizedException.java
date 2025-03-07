package com.ssafy.sosangomin.common.exception;

import org.springframework.http.HttpStatus;

public class UnAuthorizedException extends SosangominException {
    public UnAuthorizedException(ErrorMessage errorMessage) {
        super(HttpStatus.UNAUTHORIZED, errorMessage);
    }
}
