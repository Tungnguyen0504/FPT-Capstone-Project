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
@Table(name = "bank_detail")
@AttributeOverride(name = "id", column = @Column(name = "bankDetailId"))
public class BankDetail extends BaseEntity{
    @Column(nullable = false)
    private String accountNumber;

    @Column(nullable = false)
    private String accountName;

    @Column(nullable = false)
    private String acqId;
}
