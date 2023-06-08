import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SellerPagesRoutingModule } from "./seller-pages-routing.module";
import { SellerPagesComponent } from "./seller-pages.component";
import { FormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { DialogModule } from "primeng/dialog";
import { DropdownModule } from "primeng/dropdown";
import { InputSwitchModule } from "primeng/inputswitch";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { ToastModule } from "primeng/toast";
import { RestaurantsModule } from "../restaurants/restaurants.module";
import { ToggleButtonModule } from "primeng/togglebutton";
import { HttpClientModule } from "@angular/common/http";

@NgModule({
  declarations: [
    SellerPagesComponent
  ],
  imports: [
    CommonModule,
    SellerPagesRoutingModule,
    TableModule,
    DropdownModule,
    FormsModule,
    ButtonModule,
    TagModule,
    DialogModule,
    ToastModule,
    InputSwitchModule,
    ToggleButtonModule,
    RestaurantsModule,
    HttpClientModule,
  ]
})
export class SellerPagesModule { }
