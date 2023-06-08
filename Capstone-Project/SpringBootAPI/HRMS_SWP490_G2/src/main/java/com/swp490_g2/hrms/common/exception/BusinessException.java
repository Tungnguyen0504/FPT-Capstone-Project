package com.swp490_g2.hrms.common.exception;

import com.google.gson.JsonObject;
import lombok.Getter;
import com.swp490_g2.hrms.common.constants.ErrorStatusConstants;

@Getter
public class BusinessException extends RuntimeException {

    private static String GetJsonExceptionMessage(ErrorStatusConstants errorStatus) {
        JsonObject msgJson = new JsonObject();
        msgJson.addProperty("errorCode", errorStatus.getErrorCode());
        msgJson.addProperty("message", errorStatus.getMessage());
        return msgJson.toString();
    }

    private static String GetJsonExceptionMessage(String msg) {
        JsonObject msgJson = new JsonObject();
        msgJson.addProperty("message", msg);
        return msgJson.toString();
    }

    public BusinessException(String msg){
        super(GetJsonExceptionMessage(msg));
    }

    public BusinessException(ErrorStatusConstants errorStatus) {
        super(GetJsonExceptionMessage(errorStatus));
    }
}
