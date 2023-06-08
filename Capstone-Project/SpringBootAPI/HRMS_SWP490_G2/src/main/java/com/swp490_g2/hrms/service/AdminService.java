package com.swp490_g2.hrms.service;

import com.swp490_g2.hrms.common.utils.CommonUtils;
import com.swp490_g2.hrms.config.AuthenticationFacade;
import com.swp490_g2.hrms.entity.*;
import com.swp490_g2.hrms.entity.enums.RequestingRestaurantStatus;
import com.swp490_g2.hrms.entity.enums.Role;
import com.swp490_g2.hrms.entity.enums.UserStatus;
import com.swp490_g2.hrms.entity.shallowEntities.SearchSpecification;
import com.swp490_g2.hrms.repositories.UserRepository;
import com.swp490_g2.hrms.requests.SearchRequest;
import com.swp490_g2.hrms.response.AdminPagesSummary;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Getter
public class AdminService {
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


    private AuthenticationFacade authenticationFacade;

    @Autowired
    public void setAuthenticationFacade(AuthenticationFacade authenticationFacade) {
        this.authenticationFacade = authenticationFacade;
    }

    private BuyerService buyerService;

    @Autowired
    public void setBuyerService(BuyerService buyerService) {
        this.buyerService = buyerService;
    }

    private RestaurantService restaurantService;

    @Autowired
    public void setRestaurantService(RestaurantService restaurantService) {
        this.restaurantService = restaurantService;
    }

    private WebSocketService webSocketService;

    @Autowired
    public void setWebSocketService(WebSocketService webSocketService) {
        this.webSocketService = webSocketService;
    }

    ////////////

    public List<User> getAllOpeningRestaurantRequests() {
        User currentUser = userService.getCurrentUser();
        if (currentUser == null || !currentUser.isAdmin()) {
            return List.of();
        }

        return this.buyerService.getAllOpeningRestaurantRequests();
    }

    public Page<User> getAllUsers(SearchRequest request) {
        SearchSpecification<User> specification = new SearchSpecification<>(request);
        Pageable pageable = SearchSpecification.getPageable(request.getPage(), request.getSize());
        return userRepository.findAll(specification, pageable);
    }

    @Transactional
    public String approveBecomeSeller(Long buyerId) {
        User currentUser = userService.getCurrentUser();
        if (currentUser == null || !currentUser.isAdmin()) {
            return "\"Current user is not admin!\"";
        }

        User requester = userService.getById(buyerId);
        if (requester == null)
            return "\"Invalid requester!\"";

        Restaurant restaurant = restaurantService.getById(requester.getRequestingRestaurant().getId());
        if (restaurant != null) {
            String errorMessage = addRestaurantForSeller(requester.getId(), restaurant.getId());
            if (errorMessage != null)
                return errorMessage;

            if (!requester.getRequestingRestaurant().isActive()) {
                restaurant.setActive(true);
                restaurantService.update(restaurant);
            }
        }

        requester.setRequestingRestaurantStatus(RequestingRestaurantStatus.APPROVED);
        requester.getRoles().add(Role.SELLER);
        requester.setRequestingRestaurant(null);

        assert restaurant != null;
        webSocketService.push("/notification", Notification.builder()
                .toUsers(List.of(requester))
                .message("Your restaurant [%s] has been approved!".formatted(restaurant.getRestaurantName()))
                .url("/restaurant/%d".formatted(restaurant.getId()))
                .build());

        userService.update(requester);
        return null;
    }

    @Transactional
    public String addRestaurantForSeller(Long sellerId, Long restaurantId) {
        User user = userService.getById(sellerId);
        if (!user.getRoles().contains(Role.SELLER)) {
            user.getRoles().add(Role.SELLER);
            userService.update(user);
        }

        List<Restaurant> ownedRestaurants = restaurantService.getAllBySellerId(sellerId);
        if (ownedRestaurants.stream().anyMatch(r -> r.getId().equals(restaurantId)))
            return "\"The seller already owned this restaurant\"";

        userRepository.addRestaurantForSeller(sellerId, restaurantId);
        return null;
    }

    @Transactional
    public void rejectBecomeSeller(Long buyerId, String reasons) {
        User currentUser = userService.getCurrentUser();
        if (currentUser == null || !currentUser.isAdmin()) {
            return;
        }

        User requester = userService.getById(buyerId);
        if (requester == null)
            return;

        requester.setRequestingRestaurantStatus(RequestingRestaurantStatus.REJECTED);
        requester.setRejectRestaurantOpeningRequestReasons(reasons);
        userService.update(requester);

        webSocketService.push("/notification", Notification.builder()
                .toUsers(List.of(requester))
                .message("Your opening restaurant request has been rejected!")
                .url("/account-information")
                .build());
    }

    public List<Restaurant> getAllRestaurant() {
        allowAdminExecuteAction();
        return restaurantService.getAll();
    }

    public Restaurant getRestaurantById(Long restaurantId) {
        allowAdminExecuteAction();
        return restaurantService.getById(restaurantId);
    }

    @Transactional
    public String insertNewRestaurant(Restaurant restaurant) {
        allowAdminExecuteAction();

        if (restaurant.getOwners().isEmpty())
            return "\"This restaurant must have at least 1 owner!\"";

        restaurant.setActive(true);
        Restaurant addedRestaurant = restaurantService.insert(restaurant);
        for (User owner : restaurant.getOwners()) {
            String errorMessage = addRestaurantForSeller(owner.getId(), addedRestaurant.getId());
            if (errorMessage != null)
                return errorMessage;
        }

        return null;
    }

    public void updateRestaurant(Restaurant restaurant) {
        allowAdminExecuteAction();
        restaurantService.update(restaurant);
    }

    public void deleteRestaurantInactive(Long restaurantId) {
        allowAdminExecuteAction();
        restaurantService.deleteRestaurantInactive(restaurantId);
    }

    public List<User> getAllUserExceptAdmin() {
        allowAdminExecuteAction();
        return userService.getAllByRoles(List.of(Role.USER, Role.BUYER, Role.SELLER));
    }

    private void allowAdminExecuteAction() {
        User currentAdmin = userService.getCurrentUser();
        if (currentAdmin == null)
            throw new AccessDeniedException("This request allows admin only!");
    }

    public AdminPagesSummary adminPages_getSummary() {
        allowAdminExecuteAction();
        Object[] objects = (Object[]) userRepository.adminPages_getSummary();
        return AdminPagesSummary.builder()
                .totalOrders(CommonUtils.toLong(objects[0]))
                .totalUsers(CommonUtils.toLong(objects[1]))
                .totalRestaurants(CommonUtils.toLong(objects[2]))
                .totalRestaurantOpeningRequests(CommonUtils.toLong(objects[3]))
                .build();
    }

    public String banUser(User user) {
        allowAdminExecuteAction();
        User existedUser = userService.getById(user.getId());
        if (existedUser == null) {
            return "\"User not existed!\"";
        }

        if (existedUser.isAdmin()) {
            return "\"Admin cannot be banned!\"";
        }

        existedUser.setUserStatus(UserStatus.BANNED);
        existedUser.setBannedReasons(user.getBannedReasons());
        userService.update(existedUser);
        return null;
    }

    public String unbanUser(User user) {
        allowAdminExecuteAction();
        User existedUser = userService.getById(user.getId());
        if (existedUser == null) {
            return "\"User not existed!\"";
        }

        if (existedUser.isAdmin()) {
            return "\"Admin cannot be unbanned!\"";
        }

        existedUser.setUserStatus(UserStatus.ACTIVE);
        existedUser.setBannedReasons(null);
        userService.update(existedUser);
        return null;
    }

    @Transactional
    public String removeRestaurantsByRestaurantIdsForSeller(Long sellerId, boolean removeAll, List<Long> restaurantIds) {
        allowAdminExecuteAction();
        User user = userService.getById(sellerId);
        if (!user.getRoles().contains(Role.SELLER)) {
            return "\"This user is not a seller!\"";
        }

        if (!removeAll) {
            List<Restaurant> ownedRestaurants = restaurantService.getAllBySellerId(sellerId);
            if (ownedRestaurants.stream().allMatch(r -> restaurantIds.contains(r.getId()))) {
                user.getRoles().removeIf(r -> r.equals(Role.SELLER));
                userService.update(user);
            }

            userRepository.removeRestaurantsByRestaurantIdsForSeller(sellerId, restaurantIds);
        } else {
            user.getRoles().removeIf(r -> r.equals(Role.SELLER));
            userService.update(user);
            userRepository.removeAllRestaurantsForSeller(sellerId);
        }

        return null;
    }

    public String promoteUserToAdmin(Long userId) {
        allowAdminExecuteAction();
        User existedUser = userService.getById(userId);
        if (existedUser == null) {
            return "\"User not existed!\"";
        }

        existedUser.getRoles().add(Role.ADMIN);
        userService.update(existedUser);
        return null;
    }

    public String promoteUserToBuyer(Long userId) {
        allowAdminExecuteAction();
        User existedUser = userService.getById(userId);
        if (existedUser == null) {
            return "\"User not existed!\"";
        }

        existedUser.getRoles().add(Role.BUYER);
        existedUser.setUserStatus(UserStatus.ACTIVE);
        userService.update(existedUser);
        return null;
    }
}
