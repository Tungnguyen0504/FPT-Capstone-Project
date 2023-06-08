package com.swp490_g2.hrms.requests;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import jakarta.validation.constraints.Pattern;
import lombok.*;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@JsonNaming(PropertyNamingStrategies.LowerCamelCaseStrategy.class)
public class ChangePasswordRequest {

    private String emailOrPhoneNumber;

    private boolean currentPasswordRequired = false;

    private String currentPassword;

    @Pattern(regexp = "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[ !\"#$%&'()*+,-./:;<=>?@\\[\\\\\\]^_`{|}~]).{8,25}$", flags = Pattern.Flag.UNICODE_CASE)
    private String password;
}
