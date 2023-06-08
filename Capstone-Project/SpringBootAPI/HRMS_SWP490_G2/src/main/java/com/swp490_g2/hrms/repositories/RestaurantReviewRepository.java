package com.swp490_g2.hrms.repositories;

import com.swp490_g2.hrms.entity.Restaurant;
import com.swp490_g2.hrms.entity.RestaurantReview;
import com.swp490_g2.hrms.entity.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface RestaurantReviewRepository extends JpaRepository<RestaurantReview, Long>, JpaSpecificationExecutor<RestaurantReview> {

    RestaurantReview findByReviewerAndRestaurant(User reviewer, Restaurant restaurant);

    @Query(value = """
            select coalesce(avg(stars), 0)
            	from restaurant_review
                where restaurant_restaurantId = :restaurantId
                ;
            """, nativeQuery = true)
    Float getAverageStarsByRestaurantId(Long restaurantId);

    @Query(value = """
            select count(stars)
            	from restaurant_review
                where restaurant_restaurantId = :restaurantId
            		and stars = :stars
                ;
            """, nativeQuery = true)
    Long getCountStarsByRestaurantIdAndStars(Long restaurantId, Short stars);

    @Query(value = """
            select count(stars)
            	from restaurant_review
                where restaurant_restaurantId = :restaurantId
                ;
            """, nativeQuery = true)
    Long getCountStarsByRestaurantId(Long restaurantId);

    List<RestaurantReview> getAllByRestaurantId(Long id);
}
