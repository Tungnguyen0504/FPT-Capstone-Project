import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ChartRevenueComponent } from "./chart-revenue.component";
import { ChartRevenueRoutingModule } from "./chart-revenue-routing.module";
import { ChartModule } from "primeng/chart";
import { ButtonModule } from "primeng/button";
import { DropdownModule } from "primeng/dropdown";
import { FormsModule } from "@angular/forms";
@NgModule({
  imports: [
    CommonModule,
    ChartRevenueRoutingModule,
    ChartModule,
    ButtonModule,
    DropdownModule,
    FormsModule,
  ],
  declarations: [ChartRevenueComponent],
})
export class ChartRevenueModule {}
