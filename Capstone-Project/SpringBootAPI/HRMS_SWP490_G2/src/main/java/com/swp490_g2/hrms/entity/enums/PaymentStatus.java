package com.swp490_g2.hrms.entity.enums;

public enum PaymentStatus {
    // ACCEPTED -> DELIVERING -> COMPLETED
    NOT_PAID,
    PAID,

    // ABORTED
    NOT_REFUNDED,
    REFUNDED,
}
