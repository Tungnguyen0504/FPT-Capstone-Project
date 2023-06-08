package com.swp490_g2.hrms.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;
import java.util.Set;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "restaurant_category")
@AttributeOverride(name = "id", column = @Column(name = "restaurantCategoryId"))
public class RestaurantCategory extends BaseEntity {
    @Column(nullable = false)
    private String restaurantCategoryName;
}
