package com.swp490_g2.hrms.service;

import com.swp490_g2.hrms.config.AuthenticationFacade;
import com.swp490_g2.hrms.entity.Notification;
import com.swp490_g2.hrms.entity.Restaurant;
import com.swp490_g2.hrms.entity.User;
import com.swp490_g2.hrms.entity.enums.RequestingRestaurantStatus;
import com.swp490_g2.hrms.entity.enums.Role;
import com.swp490_g2.hrms.repositories.UserRepository;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
@Getter
public class BuyerService {
    private RestaurantService restaurantService;

    @Autowired
    public void setRestaurantService(RestaurantService restaurantService) {
        this.restaurantService = restaurantService;
    }

    private AuthenticationFacade authenticationFacade;

    @Autowired
    public void setAuthenticationFacade(AuthenticationFacade authenticationFacade) {
        this.authenticationFacade = authenticationFacade;
    }

    private AdminService adminService;

    @Autowired
    public void setAdminService(AdminService adminService) {
        this.adminService = adminService;
    }

    private UserService userService;

    @Autowired
    public void setUserService(UserService userService) {
        this.userService = userService;
    }

    private UserRepository userRepository;

    @Autowired
    public void setUserRepository(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    private WebSocketService webSocketService;

    @Autowired
    public void setWebSocketService(WebSocketService webSocketService) {
        this.webSocketService = webSocketService;
    }

    @Transactional
    public String requestOpeningNewRestaurant(Restaurant restaurant) {
        User buyer = userService.getCurrentUser();
        if (buyer == null || !buyer.isBuyer()) {
            return "\"You don't have permission to do this action!\"";
        }

        Restaurant requestedRestaurant = restaurant;
        if (restaurant.getId() == null) {
            requestedRestaurant = restaurantService.insert(restaurant);
        } else {
            List<User> owners = userService.getAllOwnersByRestaurantIds(List.of(restaurant.getId()));

            // This user doesn't have the required restaurant
            if (owners.stream().anyMatch(o -> o.getId().equals(buyer.getId()))) {
                return "\"You already have restaurant [%s]\"".formatted(restaurant.getRestaurantName());
            }
        }

        List<Restaurant> ownedRestaurants = restaurantService.getAllBySellerId(buyer.getId());
        if (ownedRestaurants.size() >= 5) {
            return "\"You cannot own more than 5 restaurants!\"";
        }

        buyer.setRequestingRestaurant(requestedRestaurant);
        buyer.setRequestingOpeningRestaurantDate(Instant.now());
        buyer.setRequestingRestaurantStatus(RequestingRestaurantStatus.PENDING);
        requestedRestaurant.setCreatedBy(buyer.getId());

        userService.update(buyer);

        webSocketService.push("/notification", Notification.builder()
                .toUsers(userService.getAllByRoles(List.of(Role.ADMIN)))
                .message("[%s] requested to open a new restaurant".formatted(buyer.getEmail()))
                .url("/admin-pages/request-open-list")
                .build());

        return null;
    }

    public List<User> getAllOpeningRestaurantRequests() {
        User currentAdmin = this.userService.getCurrentUser();
        if (currentAdmin == null || !currentAdmin.isAdmin())
            return null;

        List<User> users = userRepository.findAll();
        return users.stream().filter(user -> user.getRequestingRestaurant() != null).toList();
    }
}
