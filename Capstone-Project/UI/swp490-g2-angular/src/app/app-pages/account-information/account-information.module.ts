import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BuyerInformationRoutingModule } from "./account-information-routing.module";
import { AccountInformationComponent } from "./account-information.component";
import { CalendarModule } from "primeng/calendar";
import { FormsModule } from "@angular/forms";
import { DropdownModule } from "primeng/dropdown";
import { InputTextModule } from "primeng/inputtext";
import { ButtonModule } from "primeng/button";
import { FileUploadModule } from "primeng/fileupload";
import { HttpClientModule } from "@angular/common/http";
import { OpenRestaurantRequestComponent } from "./open-restaurant-request/open-restaurant-request.component";
import { DialogModule } from "primeng/dialog";
import { ConfirmPopupModule } from "primeng/confirmpopup";
import { ToastModule } from "primeng/toast";
import { AccordionModule } from "primeng/accordion";
import { TableModule } from "primeng/table";
import { RestaurantsModule } from "../restaurants/restaurants.module";
import { InputTextareaModule } from "primeng/inputtextarea";
import { AutoCompleteModule } from "primeng/autocomplete";
import { AddressFieldsModule } from "./address-fields/address-fields.module";

@NgModule({
  declarations: [AccountInformationComponent, OpenRestaurantRequestComponent],
  imports: [
    CommonModule,
    BuyerInformationRoutingModule,
    CalendarModule,
    FormsModule,
    DropdownModule,
    InputTextModule,
    ButtonModule,
    FileUploadModule,
    HttpClientModule,
    DialogModule,
    ConfirmPopupModule,
    ToastModule,
    AccordionModule,
    TableModule,
    RestaurantsModule,
    InputTextareaModule,
    AutoCompleteModule,
    AddressFieldsModule,
  ],
})
export class AccountInformationModule {}
