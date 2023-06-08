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
public class RegisterRequest {

    @Pattern(regexp = "^[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}$", flags = Pattern.Flag.UNICODE_CASE)
    private String email;

    @Pattern(regexp = "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[ !\"#$%&'()*+,-./:;<=>?@\\[\\\\\\]^_`{|}~]).{8,25}$", flags = Pattern.Flag.UNICODE_CASE)
    private String password;

    @Pattern(regexp = "^(0[3|5|7|8|9])+([0-9]{8})$", flags = Pattern.Flag.UNICODE_CASE)
    private String phoneNumber;
}
