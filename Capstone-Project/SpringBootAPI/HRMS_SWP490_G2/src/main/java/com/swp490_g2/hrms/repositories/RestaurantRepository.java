package com.swp490_g2.hrms.repositories;

import com.swp490_g2.hrms.entity.Product;
import com.swp490_g2.hrms.entity.Restaurant;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.repository.query.Param;

public interface RestaurantRepository extends JpaRepository<Restaurant, Long>, JpaSpecificationExecutor<Restaurant> {
    @Transactional
    @Modifying
    @Query(value = "DELETE FROM user__restaurant WHERE restaurantId = :restaurantId and userId = :userId", nativeQuery = true)
    int deleteSellerRestaurant(@Param("restaurantId") Long restaurantId, @Param("userId") Long userId);

    @Transactional
    @Modifying
    @Query(value = "DELETE FROM restaurant__restaurant_category WHERE restaurantId = :restaurantId and restaurantCategoryId = :restaurantCategoryId", nativeQuery = true)
    int deleteRestaurantCategory(@Param("restaurantId") Long restaurantId, @Param("restaurantCategoryId") Long restaurantCategoryId);

    @Query(value = """
            select distinct r.*
            from restaurant r
            	inner join restaurant_product rp on rp.restaurant_restaurantId = r.restaurantId
                inner join product p on p.productId = rp.products_productId
                inner join restaurant__restaurant_category rrc on rrc.restaurantId = r.restaurantId
                inner join restaurant_category rc on rc.restaurantCategoryId = rrc.restaurantCategoryId
            	where (match (r.restaurantName) against (:text IN NATURAL LANGUAGE MODE)
            	or r.restaurantName like %:text%)
                or (match (p.productName) against (:text IN NATURAL LANGUAGE MODE)
            	or p.productName like %:text%)
                or (match (rc.restaurantCategoryName) against (:text IN NATURAL LANGUAGE MODE)
            	or rc.restaurantCategoryName like %:text%)
                ;
            """, nativeQuery = true)
    public List<Restaurant> fulltextSearch(String text);

    @Query(value = "select r.* from restaurant as r inner join user__restaurant as ur on r.restaurantId = ur.restaurantId where ur.userId = :userId and ur.restaurantId = :restaurantId", nativeQuery = true)
    Optional<Restaurant> getOwnerRestaurant(@Param("userId") Long userId, @Param("restaurantId") Long restaurantId);

    @Query(value = """
            select distinct r.*
            from restaurant r
            	inner join restaurant_product rp on rp.restaurant_restaurantId = r.restaurantId
            	where rp.products_productId IN :productIds
                ;
            """, nativeQuery = true)
    Restaurant findByProductsIn(List<Long> productIds);

    @Query(value = """
            select r.*
            from restaurant r
            	inner join user__restaurant ur on ur.restaurantId = r.restaurantId
            where ur.userId = :sellerId
            ;
            """, nativeQuery = true)
    List<Restaurant> findBySellerId(Long sellerId);

    @Modifying
    @Transactional
    @Query(value = "delete from user__restaurant where restaurantId = :restaurantId", nativeQuery = true)
    void deleteOwnersRestaurantByRestaurantId(@Param("restaurantId") Long restaurantId);

    @Modifying
    @Transactional
    @Query(value = "delete from restaurant_product where restaurant_restaurantId = :restaurantId", nativeQuery = true)
    void deleteProductsByRestaurantId(@Param("restaurantId") Long restaurantId);
}
