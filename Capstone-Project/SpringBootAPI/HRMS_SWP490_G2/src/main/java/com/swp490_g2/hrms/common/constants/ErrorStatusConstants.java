package com.swp490_g2.hrms.common.constants;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor

public enum ErrorStatusConstants {
    EXISTED_EMAIL(HttpStatus.BAD_REQUEST, 400000, "Email is already exists. Try again!"),
    INVALID_VERIFICATION_CODE(HttpStatus.BAD_REQUEST, 400001, "Invalid verification code."),
    NOT_EXISTED_USER(HttpStatus.BAD_REQUEST, 400003, "The user does not exist."),
    INVALID_JWT_TOKEN(HttpStatus.BAD_REQUEST, 400004, "Invalid JWT token"),
    EXPIRED_JWT_TOKEN(HttpStatus.BAD_REQUEST, 400005, "Expired JWT token"),
    UNSUPPORTED_JWT_TOKEN(HttpStatus.BAD_REQUEST, 400006, "Unsupported JWT token"),
    EMPTY_JWT(HttpStatus.BAD_REQUEST, 400007, "JWT claims string is empty"),
    INVALID_ROLE(HttpStatus.BAD_REQUEST, 400008, "Role is not exist. Please check again."),




    ;

    private final HttpStatus errorStatus;

    private final Integer errorCode;

    private final String message;

}
