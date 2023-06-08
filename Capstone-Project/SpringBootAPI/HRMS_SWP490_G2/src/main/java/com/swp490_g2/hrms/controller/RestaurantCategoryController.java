package com.swp490_g2.hrms.controller;

import com.swp490_g2.hrms.entity.ProductCategory;
import com.swp490_g2.hrms.entity.RestaurantCategory;
import com.swp490_g2.hrms.service.ProductCategoryService;
import com.swp490_g2.hrms.service.RestaurantCategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Set;

@RestController
@RequiredArgsConstructor
@RequestMapping("/restaurant-category")
public class RestaurantCategoryController {
    private final RestaurantCategoryService restaurantCategoryService;

    @GetMapping("/get-all")
    public ResponseEntity<List<RestaurantCategory>> getAll() {
        return ResponseEntity.ok(restaurantCategoryService.getAll());
    }

    @GetMapping("/get-all-restaurant-category-by-restaurant-id/{restaurantId}")
    public ResponseEntity<List<RestaurantCategory>> getAllRestaurantCategoryByRestaurantId(@PathVariable Long restaurantId) {
        return ResponseEntity.ok(restaurantCategoryService.getAllRestaurantCategoryByRestaurantId(restaurantId));
    }
}
