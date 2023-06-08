import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AddressFieldsComponent } from "./address-fields.component";
import { DropdownModule } from "primeng/dropdown";
import { FormsModule } from "@angular/forms";
import { InputTextModule } from "primeng/inputtext";

@NgModule({
  declarations: [AddressFieldsComponent],
  imports: [CommonModule, DropdownModule, FormsModule, InputTextModule],
  exports: [AddressFieldsComponent],
})
export class AddressFieldsModule {}
