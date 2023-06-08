package com.swp490_g2.hrms.response;

import com.swp490_g2.hrms.entity.RestaurantReview;
import lombok.*;
import org.springframework.data.domain.Page;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RestaurantReviewResponse {
    private Float averageStars;

    private Long[] starCounts = new Long[]{0L, 0L, 0L, 0L, 0L};

    private Page<RestaurantReview> restaurantReviewPage;
}
