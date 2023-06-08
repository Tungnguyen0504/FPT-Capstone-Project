package com.swp490_g2.hrms.repositories;

import com.swp490_g2.hrms.entity.Notification;
import com.swp490_g2.hrms.entity.Ward;
import org.aspectj.weaver.ast.Not;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long>, JpaSpecificationExecutor<Notification> {
    List<Notification> findAllByToUsersIn(List<Long> userIds);
}
