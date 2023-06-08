import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { BuyerOrdersRoutingModule } from "./buyer-orders-routing.module";
import { BuyerOrdersComponent } from "./buyer-orders.component";
import { OrderManagementModule } from "../order-management/order-management.module";


@NgModule({
  declarations: [
    BuyerOrdersComponent
  ],
  imports: [
    CommonModule,
    BuyerOrdersRoutingModule,
    OrderManagementModule,
  ]
})
export class BuyerOrdersModule { }
