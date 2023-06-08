package com.swp490_g2.hrms.entity;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "product_category")
@AttributeOverride(name = "id", column = @Column(name = "productCategoryId"))
public class ProductCategory extends BaseEntity {
    @Column(nullable = false)
    private String productCategoryName;

    // @ManyToMany(mappedBy = "categories")
    // private Set<Product> products;
}
