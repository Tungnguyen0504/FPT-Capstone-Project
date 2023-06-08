import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ViewAllRestaurantRoutingModule } from "./view-all-restaurant-routing.module";
import { ViewAllRestaurantComponent } from "./view-all-restaurant.component";
import { FormsModule } from "@angular/forms";
import { DropdownModule } from "primeng/dropdown";
import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { TagModule } from "primeng/tag";
import { DialogModule } from "primeng/dialog";
import { ToastModule } from "primeng/toast";
import { InputSwitchModule } from "primeng/inputswitch";
import { ToggleButtonModule } from "primeng/togglebutton";
import { CheckboxModule } from "primeng/checkbox";
import { InputTextModule } from "primeng/inputtext";
import { TooltipModule } from "primeng/tooltip";

@NgModule({
  declarations: [ViewAllRestaurantComponent],
  imports: [
    CommonModule,
    ViewAllRestaurantRoutingModule,
    TableModule,
    DropdownModule,
    FormsModule,
    ButtonModule,
    TagModule,
    DialogModule,
    ToastModule,
    InputSwitchModule,
    ToggleButtonModule,
    CheckboxModule,
    InputTextModule,
    TooltipModule,
  ],
})
export class ViewAllRestaurantModule {}
