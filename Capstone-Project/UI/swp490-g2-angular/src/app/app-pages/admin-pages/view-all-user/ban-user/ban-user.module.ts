import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { BanUserRoutingModule } from "./ban-user-routing.module";
import { BanUserComponent } from "./ban-user.component";
import { FormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { CheckboxModule } from "primeng/checkbox";
import { DropdownModule } from "primeng/dropdown";
import { InputTextModule } from "primeng/inputtext";
import { TableModule } from "primeng/table";
import { DividerModule } from "primeng/divider";

@NgModule({
  declarations: [BanUserComponent],
  imports: [
    CommonModule,
    BanUserRoutingModule,
    TableModule,
    DropdownModule,
    FormsModule,
    CheckboxModule,
    ButtonModule,
    InputTextModule,
    DividerModule,
  ],
})
export class BanUserModule {}
