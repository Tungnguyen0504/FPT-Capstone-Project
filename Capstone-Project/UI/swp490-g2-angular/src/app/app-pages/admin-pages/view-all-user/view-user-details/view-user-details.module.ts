import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ViewUserDetailsRoutingModule } from "./view-user-details-routing.module";
import { ViewUserDetailsComponent } from "./view-user-details.component";
import { FormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { DropdownModule } from "primeng/dropdown";
import { TableModule } from "primeng/table";
import { TabMenuModule } from "primeng/tabmenu";
import { TagModule } from "primeng/tag";
import { ViewAllUserModule } from "../view-all-user.module";

@NgModule({
  declarations: [ViewUserDetailsComponent],
  imports: [
    CommonModule,
    ViewUserDetailsRoutingModule,
    TableModule,
    DropdownModule,
    FormsModule,
    ButtonModule,
    TagModule,
    TabMenuModule,
    FormsModule,
    ButtonModule,
    ViewAllUserModule,
  ],
})
export class ViewUserDetailsModule {}
