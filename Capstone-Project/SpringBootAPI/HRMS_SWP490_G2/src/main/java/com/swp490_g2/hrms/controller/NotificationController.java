package com.swp490_g2.hrms.controller;

import com.swp490_g2.hrms.entity.File;
import com.swp490_g2.hrms.entity.Notification;
import com.swp490_g2.hrms.entity.User;
import com.swp490_g2.hrms.requests.ChangePasswordRequest;
import com.swp490_g2.hrms.requests.RegisterRequest;
import com.swp490_g2.hrms.requests.UserInformationRequest;
import com.swp490_g2.hrms.security.AuthenticationRequest;
import com.swp490_g2.hrms.security.AuthenticationResponse;
import com.swp490_g2.hrms.service.NotificationService;
import com.swp490_g2.hrms.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequiredArgsConstructor
@RequestMapping("/notification")
public class NotificationController {
    private final NotificationService notificationService;

    @GetMapping("/get-all-by-user-id/{userId}")
    public ResponseEntity<List<Notification>> getAllByUserId(@PathVariable Long userId)
    {
        return ResponseEntity.ok(notificationService.getAllByUserId(userId));
    }

    @DeleteMapping("/delete-all-by-user-id/{userId}")
    public void deleteAllByUserId(@PathVariable Long userId) {
        notificationService.deleteAllByUserId(userId);
    }

    @DeleteMapping("/delete-by-id/{id}")
    public void deleteById(@PathVariable Long id) {
        notificationService.deleteById(id);
    }
}

