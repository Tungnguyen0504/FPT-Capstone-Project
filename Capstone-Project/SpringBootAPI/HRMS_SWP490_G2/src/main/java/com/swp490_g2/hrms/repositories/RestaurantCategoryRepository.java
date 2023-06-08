package com.swp490_g2.hrms.repositories;

import com.swp490_g2.hrms.entity.RestaurantCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RestaurantCategoryRepository extends JpaRepository<RestaurantCategory, Long> {
    public List<RestaurantCategory> findAllByOrderByRestaurantCategoryNameAsc();

    @Query(value = "SELECT rc.* FROM restaurant__restaurant_category rrc JOIN restaurant_category rc\n" +
            "ON rrc.restaurantCategoryId = rc.restaurantCategoryId\n" +
            "WHERE rrc.restaurantId = 1", nativeQuery = true)
    public List<RestaurantCategory> getAllRestaurantCategoryByRestaurantId(@Param("restaurantId") Long restaurantId);
}
