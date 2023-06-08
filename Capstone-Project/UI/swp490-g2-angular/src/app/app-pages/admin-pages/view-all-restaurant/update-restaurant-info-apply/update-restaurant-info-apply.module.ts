import { ErrorHandler, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { UpdateRestaurantInfoApplyRoutingModule } from "./update-restaurant-info-apply-routing.module";
import { UpdateRestaurantInfoApplyComponent } from "./update-restaurant-info-apply.component";
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
import { HttpErrorHandler } from "src/app/global/http-error-handler";
import { DropdownModule } from "primeng/dropdown";
import { ImageAttachmentModule } from "src/app/shared/image-attachment/image-attachment.module";
import { AutoCompleteModule } from "primeng/autocomplete";
import { AddressFieldsModule } from "src/app/app-pages/account-information/address-fields/address-fields.module";

@NgModule({
  declarations: [UpdateRestaurantInfoApplyComponent],
  imports: [
    CommonModule,
    UpdateRestaurantInfoApplyRoutingModule,
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
    AutoCompleteModule
  ],
  providers: [
    {
      // processes all errors
      provide: ErrorHandler,
      useClass: HttpErrorHandler,
    },
  ],
})
export class UpdateRestaurantInfoApplyModule {}
