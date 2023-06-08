package com.swp490_g2.hrms.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.swp490_g2.hrms.common.utils.DateUtils;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Set;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "restaurant_review")
@AttributeOverride(name = "id", column = @Column(name = "restaurantReviewId"))
public class RestaurantReview extends BaseEntity {
    @ManyToOne(optional = false)
    private User reviewer;

    @ManyToOne(optional = false)
    private Restaurant restaurant;

    @Column(nullable = false)
    private Short stars;

    @Column(nullable = false, columnDefinition = "VARCHAR(255)")
    private String heading;

    @Column(nullable = false, columnDefinition = "LONGTEXT")
    private String comment;

    @ManyToOne
    private User replySeller;

    @Column(columnDefinition = "LONGTEXT")
    private String replyComment;
}
