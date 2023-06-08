package com.swp490_g2.hrms.response;

import jakarta.persistence.Entity;
import jakarta.persistence.Transient;
import lombok.*;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminPagesSummary {
    private Long totalOrders;
    private Long totalUsers;
    private Long totalRestaurants;
    private Long totalRestaurantOpeningRequests;
}
