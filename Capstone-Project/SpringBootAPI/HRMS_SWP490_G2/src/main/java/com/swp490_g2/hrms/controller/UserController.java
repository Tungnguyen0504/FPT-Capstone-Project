package com.swp490_g2.hrms.controller;

import com.swp490_g2.hrms.entity.User;
import com.swp490_g2.hrms.requests.ChangePasswordRequest;
import com.swp490_g2.hrms.requests.RegisterRequest;
import com.swp490_g2.hrms.requests.UserInformationRequest;
import com.swp490_g2.hrms.security.AuthenticationRequest;
import com.swp490_g2.hrms.security.AuthenticationResponse;
import com.swp490_g2.hrms.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
public class UserController {
    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> registerNewUserAccount(@Valid @RequestBody RegisterRequest user) {
        return ResponseEntity.ok(userService.registerNewUserAccount(user));
    }

    @GetMapping("/get-by-id/{id}")
    public ResponseEntity<User> getById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getById(id));
    }
    
    @GetMapping("")
    public ResponseEntity<User> getByEmail(@PathVariable String email) {
        return ResponseEntity.ok(userService.getByEmail(email));
    }

    @PostMapping("/verify-code")
    public ResponseEntity<String> verifyCode(@RequestParam String emailOrPhoneNumber, @RequestParam String code, @RequestParam(required = false) boolean verifyCodeOnly) {
        return ResponseEntity.ok(userService.verifyCode(emailOrPhoneNumber, code, verifyCodeOnly));
    }

    @PostMapping(value = "/login")
    public ResponseEntity<AuthenticationResponse> login(@RequestBody AuthenticationRequest loginRequest) throws Exception {
        return ResponseEntity.ok(userService.login(loginRequest));
    }

    @GetMapping("/get-current-user")
    public ResponseEntity<User> getCurrentUser() {
        return ResponseEntity.ok(userService.getCurrentUser());
    }


    @PutMapping("/change-password")
    public ResponseEntity<AuthenticationResponse> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        return ResponseEntity.ok(userService.changePassword(request));
    }

    @PutMapping("/update")
    public void update(@Valid @RequestBody UserInformationRequest userInformationRequest){
        userService.update(userInformationRequest);
    }

    @PutMapping("/update-raw")
    public void update(@RequestBody User user){
        userService.update(user);
    }

    @PostMapping("/get-all-owners-by-restaurant-ids")
    public List<User> getAllOwnersByRestaurantIds(@RequestBody List <Long> restaurantIds) {
        return userService.getAllOwnersByRestaurantIds(restaurantIds);
    }

    @GetMapping("/send-verification-code/{emailOrPhoneNumber}")
    public void sendVerificationCode(@PathVariable String emailOrPhoneNumber) {
        userService.sendVerificationCode(emailOrPhoneNumber);
    }

    @GetMapping("has-controls-of-restaurant/{restaurantId}")
    public ResponseEntity<Boolean> hasControlsOfRestaurant(@PathVariable Long restaurantId) {
        return ResponseEntity.ok(userService.hasControlsOfRestaurant(restaurantId));
    }

    @GetMapping("/get-admin-contacts")
    public ResponseEntity<List<User>> getAdminContacts() {
        return ResponseEntity.ok(userService.getAdminContacts());
    }
}

