package com.swp490_g2.hrms.service;

import com.swp490_g2.hrms.entity.Notification;
import com.swp490_g2.hrms.entity.User;
import com.swp490_g2.hrms.repositories.UserRepository;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@Getter
public class WebSocketService {
    private SimpMessagingTemplate simpMessagingTemplate;

    @Autowired
    public void setSimpMessagingTemplate(SimpMessagingTemplate simpMessagingTemplate) {
        this.simpMessagingTemplate = simpMessagingTemplate;
    }

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

    private NotificationService notificationService;

    @Autowired
    public void setNotificationService(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    //    @Scheduled(fixedRate = 5000)
    public void push(String destination, Notification notification) {
        // Example: destination = "/message"
        Notification insertedNotification = this.notificationService.insert(notification);
        simpMessagingTemplate.convertAndSend(destination, insertedNotification);
    }


}
