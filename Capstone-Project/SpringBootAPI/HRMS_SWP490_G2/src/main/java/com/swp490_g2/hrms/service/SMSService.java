package com.swp490_g2.hrms.service;

import com.swp490_g2.hrms.common.exception.BusinessException;
import lombok.Getter;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;

import com.twilio.Twilio;
import com.twilio.converter.Promoter;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import org.springframework.util.CollectionUtils;

import java.net.URI;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
@Getter
public class SMSService {
    // Find your Account Sid and Token at twilio.com/console

    @Value("${smsService.accountSid}")
    private String ACCOUNT_SID;

    @Value("${smsService.authToken}")
    private String AUTH_TOKEN;

    @Value("${smsService.extension}")
    private String extension;

    @Value("${smsService.testPhoneNumber}")
    private String testPhoneNumber;

    @Value("${smsService.messageServiceSid}")
    private String messageServiceSid;

    @Value("${smsService.isTest}")
    private boolean isTest;

    public void init() {
        if (isTest)
            return;

        if (StringUtils.isEmpty(ACCOUNT_SID))
            throw new BusinessException(requiredBusinessExceptionMessage("smsService.accountSid"));

        if (StringUtils.isEmpty(AUTH_TOKEN))
            throw new BusinessException(requiredBusinessExceptionMessage("smsService.authToken"));

        Twilio.init(ACCOUNT_SID, AUTH_TOKEN);
    }

    private static String requiredBusinessExceptionMessage(String field) {
        return "\"%s\" is required in application.properties".formatted(field);
    }

    public void sendMessage(String phoneNumber, String bodyMessage) {
        if (phoneNumber.isEmpty() || StringUtils.isEmpty(bodyMessage))
            return;
        List a = new ArrayList<>();
        if (CollectionUtils.isEmpty(a)) {

            if (isTest)
                return;

            if (StringUtils.isEmpty(messageServiceSid))
                throw new BusinessException(requiredBusinessExceptionMessage("smsService.messageServiceSid"));

            phoneNumber = !StringUtils.isEmpty(testPhoneNumber) ? testPhoneNumber : extension + phoneNumber.substring(1);

            Message message = Message.creator(
                            new com.twilio.type.PhoneNumber(phoneNumber),
                            messageServiceSid,
                            bodyMessage)
                    .create();
        }
    }
}
