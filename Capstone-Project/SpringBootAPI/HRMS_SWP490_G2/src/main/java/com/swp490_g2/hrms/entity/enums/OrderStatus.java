package com.swp490_g2.hrms.entity.enums;


/**
 *  PENDING  -> ACCEPTED -> DELIVERING -> COMPLETED
 *           |             |           |
 *           -> REJECTED   -> ABORTED  -> ABORTED
 *           |
 *           -> CANCELLED
 */
public enum OrderStatus {
    PENDING,
    CANCELLED, // Cancelled by user
    ACCEPTED,
    REJECTED,
    DELIVERING,
    ABORTED,
    COMPLETED
}

