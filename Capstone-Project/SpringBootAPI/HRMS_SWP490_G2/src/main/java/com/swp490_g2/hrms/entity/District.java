package com.swp490_g2.hrms.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Inheritance(strategy = InheritanceType.JOINED)
@Table(name = "district")
@AttributeOverride(name = "id", column = @Column(name = "districtId"))
public class District extends BaseEntity{

    @Column(nullable = false)
    private String districtName;

    @ManyToOne
    @JoinColumn(name = "cityId", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private City city;

}
