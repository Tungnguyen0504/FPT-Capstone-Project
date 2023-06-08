package com.swp490_g2.hrms.entity;

import com.swp490_g2.hrms.entity.enums.OrderStatus;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Inheritance(strategy = InheritanceType.JOINED)
@Table(name = "order_ticket")
@AttributeOverride(name = "id", column = @Column(name = "orderTicketId"))
public class OrderTicket extends BaseEntity{

//    @ManyToOne(optional = false)
    @ManyToOne(optional = false)
    @JoinColumn(name = "orderId", nullable = false)
    private Order order;

    @Column(nullable = false)
    private String message;

    @Column(columnDefinition = "nvarchar(16)")
    @Enumerated(EnumType.STRING)
    private OrderStatus status;
}
