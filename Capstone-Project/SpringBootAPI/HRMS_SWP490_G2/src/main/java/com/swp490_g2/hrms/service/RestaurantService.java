package com.swp490_g2.hrms.service;

import com.swp490_g2.hrms.common.utils.CommonUtils;
import com.swp490_g2.hrms.entity.*;
import com.swp490_g2.hrms.entity.enums.RequestingRestaurantStatus;
import com.swp490_g2.hrms.entity.shallowEntities.FieldType;
import com.swp490_g2.hrms.entity.shallowEntities.Operator;
import com.swp490_g2.hrms.entity.shallowEntities.SortDirection;
import com.swp490_g2.hrms.repositories.RestaurantRepository;
import com.swp490_g2.hrms.repositories.UserRepository;
import com.swp490_g2.hrms.requests.*;
import com.swp490_g2.hrms.response.RestaurantReviewResponse;
import jakarta.transaction.Transactional;
import lombok.Getter;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

@Service
@Getter
public class RestaurantService {
    private RestaurantRepository restaurantRepository;

    @Autowired
    public void setRestaurantRepository(RestaurantRepository restaurantRepository) {
        this.restaurantRepository = restaurantRepository;
    }

    private UserRepository userRepository;

    @Autowired
    public void setUserRepository(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    private FileService fileService;

    @Autowired
    public void setFileService(FileService fileService) {
        this.fileService = fileService;
    }

    private UserService userService;

    @Autowired
    public void setUserService(UserService userService) {
        this.userService = userService;
    }

    private AddressService addressService;

    @Autowired
    public void setAddressService(AddressService addressService) {
        this.addressService = addressService;
    }

    private RestaurantService restaurantService;

    @Autowired
    public void setRestaurantService(RestaurantService restaurantService) {
        this.restaurantService = restaurantService;
    }

    private RestaurantReviewService restaurantReviewService;

    @Autowired
    public void setRestaurantReviewService(RestaurantReviewService restaurantReviewService) {
        this.restaurantReviewService = restaurantReviewService;
    }

    private WebSocketService webSocketService;

    @Autowired
    public void setWebSocketService(WebSocketService webSocketService) {
        this.webSocketService = webSocketService;
    }

    /// Methods
    public Restaurant insert(Restaurant restaurant) {
        if (restaurant == null)
            return null;
        restaurant.setId(null);

        User currentUser = userService.getCurrentUser();
        if (currentUser != null)
            restaurant.setCreatedBy(currentUser.getId());
        restaurant.setAddress(addressService.populateLatLng(restaurant.getAddress()));
        return restaurantRepository.save(restaurant);
    }

    public Restaurant getById(Long id) {
        Restaurant restaurant = restaurantRepository.findById(id).orElse(null);
        if (restaurant == null)
            return null;
//
//        if (!restaurant.getReviews().isEmpty()) {
//            long total = restaurant.getReviews().stream().mapToLong(RestaurantReview::getStars).sum();
//            restaurant.setAverageStars(total * 1f / restaurant.getReviews().size());
//        }

        return restaurant;
    }

    public void updateAvatar(Long id, MultipartFile imageFile) {
        Restaurant restaurant = this.getById(id);
        if (restaurant == null)
            return;

        String path = fileService.save(imageFile, "restaurant", "avatar");
        File avatarImage = File.builder()
                .filePath(path)
                .build();

        Long currentUserId = this.userService.getCurrentUser().getId();
        avatarImage.setCreatedBy(currentUserId);
        avatarImage.setModifiedBy(currentUserId);
        restaurant.setAvatarFile(avatarImage);

        restaurantRepository.save(restaurant);
    }

    public String update(Restaurant restaurant) {
        if (restaurant == null)
            return "\"Invalid restaurant!\"";

        User currentUser = userService.getCurrentUser();
        if (!currentUser.isAdmin()
                && !restaurant.isActive()
        ) {
            return "\"Ask admin to activate restaurant before making changes!\"";
        }

        if (restaurant.getBankDetail() != null) {
            if (StringUtils.isEmpty(restaurant.getBankDetail().getAccountName())
                    || StringUtils.isEmpty(restaurant.getBankDetail().getAccountName())
                    || StringUtils.isEmpty(restaurant.getBankDetail().getAcqId())
            ) {
                restaurant.setBankDetail(null);
            }
        }

        Restaurant existedRestaurant = getById(restaurant.getId());
        if (existedRestaurant.getAddress() == null
                || restaurant.getAddress() == null
                || !existedRestaurant.getAddress().getId().equals(restaurant.getAddress().getId())
                || !existedRestaurant.getAddress().getSpecificAddress().equals(restaurant.getAddress().getSpecificAddress())
                || !existedRestaurant.getAddress().getWard().getId().equals(restaurant.getAddress().getWard().getId())
        ) {
            restaurant.setAddress(addressService.populateLatLng(restaurant.getAddress()));
        }

        restaurantRepository.save(restaurant);
        return null;
    }

    @Transactional
    public void deleteRestaurantInactive(Long id) {
        List<User> users = userRepository.findAllByRequestingRestaurantId(id);

        if (users != null) {
            users.forEach(user -> {
                user.setRequestingRestaurant(null);
                user.setRejectRestaurantOpeningRequestReasons(null);
                user.setRequestingRestaurantStatus(RequestingRestaurantStatus.PENDING);
                userService.update(user);
            });
        }

        restaurantRepository.deleteOwnersRestaurantByRestaurantId(id);
        restaurantRepository.deleteProductsByRestaurantId(id);
        restaurantReviewService.deleteByRestaurantId(id);
        restaurantRepository.deleteById(id);
    }


    /**
     * @param distance
     * @param userId
     * @param fullText
     * @param includeInactive
     * @param searchRestaurantsRequest
     * @return
     */
    public Page<Restaurant> search(Double distance,
                                   Long userId,
                                   String fullText,
                                   boolean includeInactive,
                                   SearchRestaurantsRequest searchRestaurantsRequest) {
        List<Restaurant> ownedRestaurants;

        boolean isOwner = searchRestaurantsRequest != null && searchRestaurantsRequest.getOwner() != null;
        if (isOwner) {
            ownedRestaurants = getAllBySellerId(searchRestaurantsRequest.getOwner().getId());
        } else {
            ownedRestaurants = new ArrayList<>();
        }

        List<Restaurant> restaurants;
        if (fullText == null || fullText.isEmpty())
            restaurants = restaurantRepository.findAll();
        else restaurants = restaurantRepository.fulltextSearch(fullText);

        User user = userId != null ? userService.getById(userId) : null;

        if (searchRestaurantsRequest != null
                && searchRestaurantsRequest.getDestinationAddress() != null
                && searchRestaurantsRequest.getDestinationAddress().isValid()
        ) {
            searchRestaurantsRequest.setDestinationAddress(addressService.populateLatLng(searchRestaurantsRequest.getDestinationAddress()));
        }

        List<Restaurant> filteredRestaurants = restaurants.stream()
                .filter(restaurant -> includeInactive || restaurant.isActive())
                .filter(restaurant -> {
                    if (distance == null || user == null)
                        return true;

                    if (restaurant.getAddress() == null)
                        return false;

                    if (searchRestaurantsRequest == null
                            || searchRestaurantsRequest.getDestinationAddress() == null
                            || !searchRestaurantsRequest.getDestinationAddress().isValid()
                    ) {
                        return false;
                    }

                    return CommonUtils.haversine_distance(restaurant.getAddress().getLat(), restaurant.getAddress().getLng(),
                            searchRestaurantsRequest.getDestinationAddress().getLat(), searchRestaurantsRequest.getDestinationAddress().getLng()) < distance;
                })
                .filter(restaurant -> {
                    if (searchRestaurantsRequest == null
                            || searchRestaurantsRequest.getRestaurantCategories() == null
                            || searchRestaurantsRequest.getRestaurantCategories().size() == 0
                    ) {
                        return true;
                    }

                    return restaurant.getRestaurantCategories().stream()
                            .anyMatch(restaurantCategory -> searchRestaurantsRequest.getRestaurantCategories().stream()
                                    .anyMatch(comparedCategory -> Objects.equals(comparedCategory.getId(), restaurantCategory.getId())));
                })
                .filter(restaurant -> {
                    if (isOwner) {
                        return ownedRestaurants.stream().anyMatch(or -> or.getId().equals(restaurant.getId()));
                    }

                    return true;
                })
                .sorted(user == null
                        || searchRestaurantsRequest == null
                        || searchRestaurantsRequest.getDestinationAddress() == null
                        || !searchRestaurantsRequest.getDestinationAddress().isValid()
                        ? Comparator.comparing(Restaurant::getRestaurantName)
                        : Comparator.comparingDouble(restaurant ->
                        CommonUtils.haversine_distance(restaurant.getAddress().getLat(), restaurant.getAddress().getLng(),
                                searchRestaurantsRequest.getDestinationAddress().getLat(), searchRestaurantsRequest.getDestinationAddress().getLng())
                ))
                .toList();

        filteredRestaurants.forEach(r -> {
            r.setAverageStars(restaurantReviewService.getAverageStarsByRestaurantId(r.getId()));
        });

        if (searchRestaurantsRequest == null || searchRestaurantsRequest.getSearchRequest() == null)
            return new PageImpl<>(filteredRestaurants);

        return new PageImpl<>(filteredRestaurants.subList(
                searchRestaurantsRequest.getSearchRequest().getSize() * searchRestaurantsRequest.getSearchRequest().getPage(),
                Integer.min(searchRestaurantsRequest.getSearchRequest().getSize() * searchRestaurantsRequest.getSearchRequest().getPage()
                        + searchRestaurantsRequest.getSearchRequest().getSize(), filteredRestaurants.size())
        ),
                PageRequest.of(searchRestaurantsRequest.getSearchRequest().getPage(),
                        searchRestaurantsRequest.getSearchRequest().getSize()),
                filteredRestaurants.size());
    }

    public List<Restaurant> getAll() {
        User user = userService.getCurrentUser();
        if (user.isAdmin())
            return restaurantRepository.findAll();

        if (user.isSeller())
            return getAllBySellerId(user.getId());

        return null;
    }

    public RestaurantInformationRequest getRestaurantById(Long id) {
        Restaurant restaurant = restaurantRepository.getById(id);
        User user = userService.getByRestaurantId(id);
        RestaurantInformationRequest request = RestaurantInformationRequest.set(user, restaurant);
        return request;
    }

    public Restaurant getByProductId(Long productId) {
        return restaurantRepository.findByProductsIn(List.of(productId));
    }

    public List<Restaurant> getAllBySellerId(Long sellerId) {
        return restaurantRepository.findBySellerId(sellerId);
    }

    public String review(RestaurantReview review) {
        User reviewer = userService.getCurrentUser();
        if (review == null
                || reviewer == null
                || review.getRestaurant() == null
                || StringUtils.isEmpty(review.getHeading())
                || StringUtils.isEmpty(review.getComment())
        ) {
            return "\"Invalid review!\"";
        }

        review.setReviewer(reviewer);
        RestaurantReview existedReview = restaurantReviewService.getByReviewerAndRestaurant(reviewer, review.getRestaurant());
        if (existedReview != null) {
            review.setId(existedReview.getId());
            restaurantReviewService.update(review);
        } else {
            restaurantReviewService.insert(review);
        }

        webSocketService.push("/notification", Notification.builder()
                .toUsers(userService.getAllOwnersByRestaurantIds(List.of(review.getRestaurant().getId())))
                .message("A new review for restaurant [%s] has been added!".formatted(review.getRestaurant().getRestaurantName()))
                .url("/restaurant/%d".formatted(review.getRestaurant().getId()))
                .build());

        return null;
    }

    public RestaurantReviewResponse getReviewsByRestaurantId(Long restaurantId, SearchRequest request) {
        List<FilterRequest> filters = new ArrayList<>(List.of(
                FilterRequest.builder()
                        .key("restaurant.id")
                        .fieldType(FieldType.LONG)
                        .operator(Operator.EQUAL)
                        .value(restaurantId)
                        .build()
        ));

        request.getFilters().stream().filter(f -> f.getKey().equals("stars")).findFirst().ifPresent(filters::add);

        SearchRequest searchRequest = SearchRequest.builder()
                .filters(filters)
                .page(request.getPage())
                .size(request.getSize())
                .sorts(List.of(SortRequest.builder()
                        .key("createdAt")
                        .direction(SortDirection.DESC)
                        .build()))
                .build();

        return RestaurantReviewResponse.builder()
                .averageStars(this.restaurantReviewService.getAverageStarsByRestaurantId(restaurantId))
                .starCounts(this.restaurantReviewService.getStarCounts(restaurantId))
                .restaurantReviewPage(this.restaurantReviewService.search(searchRequest))
                .build();
    }

    public String replyReview(RestaurantReview review) {
        if (review == null
                || review.getReviewer() == null
                || review.getRestaurant() == null
                || review.getReplySeller() == null
                || StringUtils.isEmpty(review.getHeading())
                || StringUtils.isEmpty(review.getComment())
                || StringUtils.isEmpty(review.getReplyComment())
        ) {
            return "\"Invalid reply!\"";
        }

        restaurantReviewService.update(review);
        webSocketService.push("/notification", Notification.builder()
                .toUsers(List.of(review.getReviewer()))
                .message("Your review about restaurant [%s] has been replied by its owner!".formatted(review.getRestaurant().getRestaurantName()))
                .url("/restaurant/%d".formatted(review.getRestaurant().getId()))
                .build());

        return null;
    }

    public void deleteReviewReply(RestaurantReview review) {
        if (review == null
                || review.getReviewer() == null
                || review.getRestaurant() == null
                || review.getReplySeller() == null
                || StringUtils.isEmpty(review.getHeading())
                || StringUtils.isEmpty(review.getComment())
                || StringUtils.isEmpty(review.getReplyComment())
        ) {
            return;
        }

        review.setReplySeller(null);
        review.setReplyComment(null);
        restaurantReviewService.update(review);
    }
}