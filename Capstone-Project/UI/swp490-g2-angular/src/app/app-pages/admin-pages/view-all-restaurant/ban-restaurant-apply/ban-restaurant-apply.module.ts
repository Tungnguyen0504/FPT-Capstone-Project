import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { BanRestaurantApplyRoutingModule } from "./ban-restaurant-apply-routing.module";
import { BanRestaurantApplyComponent } from "./ban-restaurant-apply.component";
import { FormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { CheckboxModule } from "primeng/checkbox";
import { DropdownModule } from "primeng/dropdown";
import { InputTextModule } from "primeng/inputtext";
import { TableModule } from "primeng/table";

@NgModule({
  declarations: [BanRestaurantApplyComponent],
  imports: [
    CommonModule,
    BanRestaurantApplyRoutingModule,
    TableModule,
    DropdownModule,
    FormsModule,
    CheckboxModule,
    ButtonModule,
    InputTextModule,
  ],
})
export class BanRestaurantApplyModule {}
