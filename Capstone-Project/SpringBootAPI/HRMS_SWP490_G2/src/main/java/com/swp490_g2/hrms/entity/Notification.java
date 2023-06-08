package com.swp490_g2.hrms.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Inheritance(strategy = InheritanceType.JOINED)
@Table(name = "notification")
@AttributeOverride(name = "id", column = @Column(name = "notificationId"))
public class Notification extends BaseEntity {
    @Column(nullable = false, columnDefinition = "LONGTEXT")
    private String message;

    @Column
    private String url;

    @ManyToMany
    private List<User> toUsers = new ArrayList<>();
}
