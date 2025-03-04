package com.ssafy.sosangomin.common.handler;

import com.ssafy.sosangomin.common.exception.ErrorMessage;
import com.ssafy.sosangomin.common.exception.FailResponse;
import com.ssafy.sosangomin.common.exception.FailResponse.ValidationError;
import com.ssafy.sosangomin.common.exception.SosangominException;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.util.List;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(SosangominException.class)
    public ResponseEntity<FailResponse> handleGlobalException(SosangominException exception) {
        log.warn("[ChocoLetterException] {}: {}", exception.getClass().getName(), exception.getErrorMessage());

        return ResponseEntity.status(exception.getStatus())
                .body(FailResponse.fail(exception.getStatus().value(), exception.getErrorMessage()));
    }

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(
            MethodArgumentNotValidException ex, HttpHeaders headers, HttpStatusCode status, WebRequest request
    ) {
        log.warn("[MethodArgumentNotValidException] {}: {}", ex.getClass().getName(), ex.getMessage());

        BindingResult bindingResult = ex.getBindingResult();
        List<FailResponse.ValidationError> validationErrors = bindingResult.getFieldErrors()
                .stream()
                .map(error -> ValidationError.of(error))
                .toList();

        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(FailResponse.failFromMethodArgumentNotValid(HttpStatus.BAD_REQUEST.value(),
                        ErrorMessage.ERR_INVALID_REQUEST_FIELD, validationErrors));
    }

    @Override
    protected ResponseEntity<Object> handleNoResourceFoundException(
            NoResourceFoundException ex, HttpHeaders headers, HttpStatusCode status, WebRequest request
    ) {
        log.warn("[NoResourceFoundException] {}: {}", ex.getClass().getName(), ex.getMessage());

        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(FailResponse.fail(HttpStatus.NOT_FOUND.value(), ErrorMessage.ERR_NOT_RESOURCE));
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<FailResponse> handleConstraintViolationException(ConstraintViolationException ex) {
        log.warn("[ConstraintViolationException] {}: {}", ex.getClass().getName(), ex.getMessage());

        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(FailResponse.fail(HttpStatus.BAD_REQUEST.value(), ErrorMessage.ERR_INVALID_QUERY_PARAMETER));
    }

}
