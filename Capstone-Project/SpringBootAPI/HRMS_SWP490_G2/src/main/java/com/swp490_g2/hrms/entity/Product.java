package com.swp490_g2.hrms.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.swp490_g2.hrms.entity.enums.OrderStatus;
import com.swp490_g2.hrms.entity.enums.ProductStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "product")
@AttributeOverride(name = "id", column = @Column(name = "productId"))
public class Product extends BaseEntity {
    @Column(nullable = false)
    private String productName;

    @Column(nullable = false)
    private Double price;

    @Column(nullable = false)
    private String description;

    @ManyToMany(cascade = {CascadeType.MERGE}, fetch = FetchType.EAGER)
    @JoinTable(name = "product__product_category",
            joinColumns = @JoinColumn(name = "productId"), inverseJoinColumns = @JoinColumn(name = "productCategoryId"))
    private Set<ProductCategory> categories;

    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE}, fetch = FetchType.EAGER)
    @JsonIgnoreProperties(value = {"hibernateLazyInitializer", "handler"}, allowSetters = true)
    private List<File> images = new ArrayList<>();

    @Column(columnDefinition = "nvarchar(16) default 'ACTIVE'", insertable = false)
    @Enumerated(EnumType.STRING)
    private ProductStatus productStatus = ProductStatus.ACTIVE;

    @Transient
    private Restaurant restaurant;
}
