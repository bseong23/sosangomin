package com.ssafy.sosangomin.common.exception;

import org.springframework.http.HttpStatus;

public class InternalServerException extends DataLensException {
    public InternalServerException(ErrorMessage errorMessage) {
        super(HttpStatus.INTERNAL_SERVER_ERROR, errorMessage);
    }
}
