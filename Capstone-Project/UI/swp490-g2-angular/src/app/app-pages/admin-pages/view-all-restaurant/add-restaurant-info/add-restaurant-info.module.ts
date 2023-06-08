import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { AddRestaurantInfoRoutingModule } from "./add-restaurant-info-routing.module";
import { AddRestaurantInfoComponent } from "./add-restaurant-info.component";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { CalendarModule } from "primeng/calendar";
import { CheckboxModule } from "primeng/checkbox";
import { FileUploadModule } from "primeng/fileupload";
import { InputTextModule } from "primeng/inputtext";
import { InputTextareaModule } from "primeng/inputtextarea";
import { RadioButtonModule } from "primeng/radiobutton";
import { ToastModule } from "primeng/toast";
import { DropdownModule } from "primeng/dropdown";
import { ImageAttachmentModule } from "src/app/shared/image-attachment/image-attachment.module";
import { AutoCompleteModule } from "primeng/autocomplete";
import { AddressFieldsModule } from "src/app/app-pages/account-information/address-fields/address-fields.module";

@NgModule({
  declarations: [AddRestaurantInfoComponent],
  imports: [
    CommonModule,
    AddRestaurantInfoRoutingModule,
    CommonModule,
    CheckboxModule,
    RadioButtonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    InputTextareaModule,
    CalendarModule,
    FileUploadModule,
    HttpClientModule,
    ToastModule,
    DropdownModule,
    AddressFieldsModule,
    ImageAttachmentModule,
    AutoCompleteModule,
  ],
})
export class AddRestaurantInfoModule {}
