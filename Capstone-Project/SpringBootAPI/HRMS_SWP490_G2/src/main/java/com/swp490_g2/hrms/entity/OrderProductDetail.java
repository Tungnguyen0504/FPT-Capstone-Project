package com.swp490_g2.hrms.entity;

import com.swp490_g2.hrms.common.exception.BusinessException;
import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "order_product_detail")
@AttributeOverride(name = "id", column = @Column(name = "orderProductDetailId"))
public class OrderProductDetail extends BaseEntity {
    @Column(nullable = false)
    @Min(1)
    @Max(999)
    private int quantity;

    @Column(nullable = false)
    private double price;

    @Column(columnDefinition = "LONGTEXT")
    private String note;

    @ManyToOne(optional = false)
    private Product product;
}
