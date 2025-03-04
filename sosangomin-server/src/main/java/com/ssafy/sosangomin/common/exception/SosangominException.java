package com.ssafy.sosangomin.common.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class SosangominException extends RuntimeException {
    HttpStatus status;
    ErrorMessage errorMessage;

    public SosangominException(HttpStatus status, ErrorMessage errorMessage) {
        super(errorMessage.toString());
        this.status = status;
        this.errorMessage = errorMessage;
    }
}
