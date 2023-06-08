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
@Table(name = "ward")
@AttributeOverride(name = "id", column = @Column(name = "wardId"))
public class Ward extends BaseEntity{

    @Column(nullable = false)
    private String wardName;

    @ManyToOne(optional = false)
    @JoinColumn(name = "districtId", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private District district;
}
