package com.swp490_g2.hrms.service;

import com.swp490_g2.hrms.entity.RestaurantCategory;
import com.swp490_g2.hrms.repositories.RestaurantCategoryRepository;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Getter
public class RestaurantCategoryService {
    private RestaurantCategoryRepository restaurantCategoryRepository;

    @Autowired
    public void setRestaurantCategoryRepository(RestaurantCategoryRepository restaurantCategoryRepository) {
        this.restaurantCategoryRepository = restaurantCategoryRepository;
    }

    public List<RestaurantCategory> getAll() {
        return this.restaurantCategoryRepository.findAllByOrderByRestaurantCategoryNameAsc();
    }

    public List<RestaurantCategory> getAllRestaurantCategoryByRestaurantId(Long restaurantId) {
        return this.restaurantCategoryRepository.getAllRestaurantCategoryByRestaurantId(restaurantId);
    }
}
