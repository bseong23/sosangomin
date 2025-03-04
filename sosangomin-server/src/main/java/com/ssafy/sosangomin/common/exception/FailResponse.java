package com.ssafy.sosangomin.common.exception;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;
import org.springframework.validation.FieldError;

import java.util.List;

@Getter
@Builder
public class FailResponse {
    private final int status;
    private final String errorMessage;

    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private final List<ValidationError> detailErrors;

    public static FailResponse fail(int status, ErrorMessage errorMessage) {
        return FailResponse.builder()
                .status(status)
                .errorMessage(errorMessage.toString())
                .build();
    }

    public static FailResponse failFromMethodArgumentNotValid(final int status, final ErrorMessage errorMessage,
                                                              final List<ValidationError> detailErrors) {
        return FailResponse.builder()
                .status(status)
                .errorMessage(errorMessage.toString())
                .detailErrors(detailErrors)
                .build();
    }

    @Builder
    public record ValidationError(
            String field,
            String message
    ) {

        public static ValidationError of(final FieldError fieldError) {
            return ValidationError.builder()
                    .field(fieldError.getField())
                    .message(fieldError.getDefaultMessage())
                    .build();
        }
    }
}


