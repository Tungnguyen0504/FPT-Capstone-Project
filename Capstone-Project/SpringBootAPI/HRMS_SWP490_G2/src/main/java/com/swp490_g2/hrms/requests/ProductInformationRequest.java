package com.swp490_g2.hrms.requests;


import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import com.swp490_g2.hrms.entity.File;
import com.swp490_g2.hrms.entity.Product;
import com.swp490_g2.hrms.entity.ProductCategory;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Set;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonNaming(PropertyNamingStrategies.LowerCamelCaseStrategy.class)
public class ProductInformationRequest {
    private String productName;
    private Double price;
    private int quantity;
    private String description;
    private List<ProductCategory> productCategories;
    private Long restaurantId;
    private Long productStatusId;

}
