package com.swp490_g2.hrms.service;

import com.swp490_g2.hrms.entity.ProductCategory;
import com.swp490_g2.hrms.repositories.ProductCategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class ProductCategoryService {
    private final ProductCategoryRepository productCategoryRepository;

    public ProductCategory getById(Long id) {
        return productCategoryRepository.findById(id).orElse(null);
    }

    public Set<ProductCategory> getAllByRestaurantId(Long restaurantId) {
        return productCategoryRepository.findAllByRestaurantId(restaurantId);
    }
}
