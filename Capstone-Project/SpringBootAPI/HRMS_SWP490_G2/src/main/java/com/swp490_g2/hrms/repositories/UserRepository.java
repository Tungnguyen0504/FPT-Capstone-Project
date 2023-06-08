package com.swp490_g2.hrms.repositories;

import com.swp490_g2.hrms.entity.User;
import com.swp490_g2.hrms.entity.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long>, JpaSpecificationExecutor<User> {
    Optional<User> findByEmail(String email);

    Optional<User> findByPhoneNumber(String phoneNumber);

    @Query(value = """
            SELECT u.* FROM user u JOIN user__restaurant ur
            ON u.userId = ur.userId
            WHERE ur.restaurantId = :restaurantId""", nativeQuery = true)
    Optional<User> findByRestaurantId(Long restaurantId);

    @Query(value = """
            SELECT u.* FROM user u JOIN user__restaurant ur
            ON u.userId = ur.userId
            WHERE ur.restaurantId IN :restaurantIds""", nativeQuery = true)
    List<User> findByRestaurantsIn(List<Long> restaurantIds);

    List<User> findByRolesIn(List<Role> roles);

    @Modifying
    @Query(value = """
            INSERT INTO `user__restaurant` (`userId`, `restaurantId`) VALUES (:sellerId, :restaurantId);
            """, nativeQuery = true)
    void addRestaurantForSeller(Long sellerId, Long restaurantId);


    @Query(value = """
            select
            	(select count(*) from `order` o) totalOrders,
                (select count(*) from `user` u) totalUsers,
                (select count(*) from `restaurant` r) totalRestaurants,
                (select count(*) from `user` u2 where u2.requestingRestaurantId is not null) totalRestaurantOpeningRequests
            limit 1
            """, nativeQuery = true)
    Object adminPages_getSummary();

    @Modifying
    @Query(value = """
            delete from user__restaurant
            where userId = :sellerId and restaurantId in :restaurantIds
            """, nativeQuery = true)
    void removeRestaurantsByRestaurantIdsForSeller(Long sellerId, List<Long> restaurantIds);

    @Modifying
    @Query(value = """
            delete from user__restaurant
            where userId = :sellerId
            """, nativeQuery = true)
    void removeAllRestaurantsForSeller(Long sellerId);

    List<User> findAllByRequestingRestaurantId(Long restaurantId);
}
