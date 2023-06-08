package com.swp490_g2.hrms.repositories;

import com.swp490_g2.hrms.entity.OrderTicket;
import com.swp490_g2.hrms.entity.enums.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderTicketRepository extends JpaRepository<OrderTicket, Long> {
    OrderTicket findFirstByOrderIdAndStatus(Long orderId, OrderStatus orderStatus);
}
