package com.swp490_g2.hrms.response;

import lombok.*;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReportIncomeOverTime {
    private String label;
    private long totalCompletedOrders;
    private long totalAbortedOrders;
    private double totalSales;
}
