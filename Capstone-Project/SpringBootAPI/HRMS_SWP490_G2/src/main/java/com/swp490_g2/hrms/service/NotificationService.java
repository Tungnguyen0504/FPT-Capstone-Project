package com.swp490_g2.hrms.service;

import com.swp490_g2.hrms.entity.Notification;
import com.swp490_g2.hrms.repositories.NotificationRepository;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Getter
public class NotificationService {
    private NotificationRepository notificationRepository;

    @Autowired
    public void setNotificationRepository(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public List<Notification> getAllByUserId(Long userId) {
        List<Notification> result = this.notificationRepository.findAllByToUsersIn(List.of(userId));
        return result.stream().sorted((a, b) -> b.getModifiedAt().compareTo(a.getModifiedAt())).toList();
    }

    public Notification insert(Notification notification) {
        notification.setId(null);
        return this.notificationRepository.save(notification);
    }

    @Transactional
    public void deleteAllByUserId(Long userId) {
        List<Notification> notifications = getAllByUserId(userId);
        notifications.forEach(notification -> {
            notification.getToUsers().removeIf(user -> user.getId().equals(userId));
            notificationRepository.save(notification);
        });
    }

    public void deleteById(Long id) {
        notificationRepository.deleteById(id);
    }
}
