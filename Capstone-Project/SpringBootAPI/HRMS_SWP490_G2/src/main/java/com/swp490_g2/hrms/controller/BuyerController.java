package com.swp490_g2.hrms.controller;

import com.swp490_g2.hrms.entity.Restaurant;
import com.swp490_g2.hrms.service.BuyerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/buyer")
public class BuyerController {

    private final BuyerService buyerService;

    @PostMapping("/request-opening-new-restaurant")
    public ResponseEntity<String> requestOpeningNewRestaurant(@RequestBody Restaurant restaurant){
        return ResponseEntity.ok(buyerService.requestOpeningNewRestaurant(restaurant));
    }
}
