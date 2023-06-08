package com.swp490_g2.hrms.controller;

import com.swp490_g2.hrms.entity.Address;
import com.swp490_g2.hrms.entity.City;
import com.swp490_g2.hrms.entity.District;
import com.swp490_g2.hrms.entity.Ward;
import com.swp490_g2.hrms.service.AddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/address")
public class AddressController {
    private final AddressService addressService;

    @GetMapping("/get-cities")
    public ResponseEntity<List<City>> getCities(){
        return ResponseEntity.ok(addressService.getCities());
    }

    @GetMapping("/get-districts-by-city-id/{cityId}")
    public ResponseEntity<List<District>> getDistrictsByCityId(@PathVariable Long cityId){
        return ResponseEntity.ok(addressService.getDistrictsByCityId(cityId));
    }

    @GetMapping("/get-wards-by-district-id/{districtId}")
    public ResponseEntity<List<Ward>> getWardsByDistrictId(@PathVariable Long districtId){
        return ResponseEntity.ok(addressService.getWardsByDistrictId(districtId));
    }

    @GetMapping("/get-by-id/{id}")
    public ResponseEntity<Address> getById(@PathVariable Long id) {
        return ResponseEntity.ok(addressService.getById(id));
    }
}
