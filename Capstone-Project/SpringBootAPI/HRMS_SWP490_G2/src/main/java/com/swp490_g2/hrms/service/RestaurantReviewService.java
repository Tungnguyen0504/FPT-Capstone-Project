package com.swp490_g2.hrms.service;

import com.swp490_g2.hrms.entity.Restaurant;
import com.swp490_g2.hrms.entity.RestaurantReview;
import com.swp490_g2.hrms.entity.User;
import com.swp490_g2.hrms.entity.shallowEntities.SearchSpecification;
import com.swp490_g2.hrms.repositories.RestaurantReviewRepository;
import com.swp490_g2.hrms.requests.SearchRequest;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.util.List;

@Service
@Getter
public class RestaurantReviewService {
    private RestaurantReviewRepository restaurantReviewRepository;

    @Autowired
    public void setRestaurantReviewRepository(RestaurantReviewRepository restaurantReviewRepository) {
        this.restaurantReviewRepository = restaurantReviewRepository;
    }

    public RestaurantReview getByReviewerAndRestaurant(User reviewer, Restaurant restaurant) {
        return restaurantReviewRepository.findByReviewerAndRestaurant(reviewer, restaurant);
    }

    public void update(RestaurantReview review) {
        if (review != null && review.getId() != null)
            restaurantReviewRepository.save(review);
    }

    public void insert(RestaurantReview review) {
        if (review == null)
            return;

        review.setId(null);
        restaurantReviewRepository.save(review);
    }

    public Page<RestaurantReview> search(SearchRequest searchRequest) {
        SearchSpecification<RestaurantReview> specification = new SearchSpecification<>(searchRequest);
        Pageable pageable = SearchSpecification.getPageable(searchRequest.getPage(), searchRequest.getSize());
        return restaurantReviewRepository.findAll(specification, pageable);
    }

    public Float getAverageStarsByRestaurantId(Long restaurantId) {
        return restaurantReviewRepository.getAverageStarsByRestaurantId(restaurantId);
    }

    public Long[] getStarCounts(Long restaurantId) {
        Long total1 = this.restaurantReviewRepository.getCountStarsByRestaurantIdAndStars(restaurantId, (short) 1);
        Long total2 = this.restaurantReviewRepository.getCountStarsByRestaurantIdAndStars(restaurantId, (short) 2);
        Long total3 = this.restaurantReviewRepository.getCountStarsByRestaurantIdAndStars(restaurantId, (short) 3);
        Long total4 = this.restaurantReviewRepository.getCountStarsByRestaurantIdAndStars(restaurantId, (short) 4);
        Long total5 = this.restaurantReviewRepository.getCountStarsByRestaurantIdAndStars(restaurantId, (short) 5);

        return new Long[]{
                total1,
                total2,
                total3,
                total4,
                total5
        };
    }

    public void delete(RestaurantReview review) {
        restaurantReviewRepository.delete(review);
    }

    public void deleteByRestaurantId(Long restaurantId) {
        List<RestaurantReview> restaurantReviewList = restaurantReviewRepository.getAllByRestaurantId(restaurantId);
        if(!CollectionUtils.isEmpty(restaurantReviewList)) {
            for (RestaurantReview restaurantReview: restaurantReviewList) {
                delete(restaurantReview);
            }
        }
    }
}