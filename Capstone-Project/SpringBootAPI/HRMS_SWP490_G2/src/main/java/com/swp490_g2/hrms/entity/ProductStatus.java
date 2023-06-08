package com.swp490_g2.hrms.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.Set;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "product_status")
@AttributeOverride(name = "id", column = @Column(name = "productStatusId"))
public class ProductStatus extends BaseEntity{
    @Column(nullable = false)
    private String productStatusName;

}
