import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { RestaurantUpdateInformationRoutingModule } from "./restaurant-update-information-routing.module";
import { RestaurantUpdateInformationComponent } from "./restaurant-update-information.component";
import { InputTextareaModule } from "primeng/inputtextarea";
import { DialogModule } from "primeng/dialog";
import { CalendarModule } from "primeng/calendar";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { InputNumberModule } from "primeng/inputnumber";
import { AddressFieldsModule } from "../../account-information/address-fields/address-fields.module";

@NgModule({
  declarations: [RestaurantUpdateInformationComponent],
  imports: [
    CommonModule,
    RestaurantUpdateInformationRoutingModule,
    DialogModule,
    InputTextareaModule,
    CalendarModule,
    FormsModule,
    ReactiveFormsModule,
    InputNumberModule,
    AddressFieldsModule,
  ],
  exports: [RestaurantUpdateInformationComponent],
})
export class RestaurantUpdateInformationModule {}
