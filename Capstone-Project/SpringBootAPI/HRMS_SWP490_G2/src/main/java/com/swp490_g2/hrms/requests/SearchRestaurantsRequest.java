package com.swp490_g2.hrms.requests;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import com.swp490_g2.hrms.entity.Address;
import com.swp490_g2.hrms.entity.RestaurantCategory;
import com.swp490_g2.hrms.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonNaming(PropertyNamingStrategies.LowerCamelCaseStrategy.class)
public class SearchRestaurantsRequest {
    private List<RestaurantCategory> restaurantCategories;
    private SearchRequest searchRequest;
    private User owner;
    private Address destinationAddress;
}
