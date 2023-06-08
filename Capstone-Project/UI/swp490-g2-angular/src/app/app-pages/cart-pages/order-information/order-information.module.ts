import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { DropdownModule } from "primeng/dropdown";
import { InputTextModule } from "primeng/inputtext";
import { ButtonModule } from "primeng/button";
import { FileUploadModule } from "primeng/fileupload";
import { HttpClientModule } from "@angular/common/http";
import { DialogModule } from "primeng/dialog";
import { ToastModule } from "primeng/toast";
import { AccordionModule } from "primeng/accordion";
import { TableModule } from "primeng/table";
import { InputTextareaModule } from "primeng/inputtextarea";
import { OrderInformationRoutingModule } from "./order-information-routing.module";
import { OrderInformationComponent } from "./order-information.component";
import { UpdateShippingAddressModule } from "../../restaurants/update-shipping-address/update-shipping-address.module";
import { CartPagesModule } from "../cart-pages.module";

@NgModule({
  declarations: [OrderInformationComponent],
  imports: [
    CommonModule,
    OrderInformationRoutingModule,
    FormsModule,
    DropdownModule,
    InputTextModule,
    ButtonModule,
    FileUploadModule,
    HttpClientModule,
    DialogModule,
    ToastModule,
    AccordionModule,
    TableModule,
    InputTextareaModule,
    UpdateShippingAddressModule,
    CartPagesModule,
  ],
})
export class OrderInformationModule {}
