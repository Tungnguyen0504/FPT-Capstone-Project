import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UpdateShippingAddressComponent } from "./update-shipping-address.component";
import { FormsModule } from "@angular/forms";
import { OverlayPanelModule } from "primeng/overlaypanel";
import { ButtonModule } from "primeng/button";
import { AddressFieldsModule } from "../../account-information/address-fields/address-fields.module";

@NgModule({
  declarations: [UpdateShippingAddressComponent],
  imports: [
    CommonModule,
    FormsModule,
    OverlayPanelModule,
    ButtonModule,
    AddressFieldsModule,
  ],
  exports: [UpdateShippingAddressComponent],
})
export class UpdateShippingAddressModule {}
