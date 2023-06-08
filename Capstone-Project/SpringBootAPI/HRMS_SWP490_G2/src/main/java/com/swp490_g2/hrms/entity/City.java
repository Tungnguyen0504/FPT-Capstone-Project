package com.swp490_g2.hrms.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Inheritance(strategy = InheritanceType.JOINED)
@Table(name = "city")
@AttributeOverride(name = "id", column = @Column(name = "cityId"))
public class City extends BaseEntity{

    @Column(nullable = false)
    private String cityName;
}
