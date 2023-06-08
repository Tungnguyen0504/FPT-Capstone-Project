import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ViewAllUserRoutingModule } from "./view-all-user-routing.module";
import { ViewAllUserComponent } from "./view-all-user.component";
import { TableModule } from "primeng/table";
import { DropdownModule } from "primeng/dropdown";
import { FormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { TooltipModule } from "primeng/tooltip";
import { RouterModule } from "@angular/router";
import { UserStatusComponent } from "./user-status/user-status.component";
import { TagModule } from "primeng/tag";

@NgModule({
  declarations: [ViewAllUserComponent, UserStatusComponent],
  imports: [
    CommonModule,
    ViewAllUserRoutingModule,
    TableModule,
    DropdownModule,
    FormsModule,
    ButtonModule,
    TooltipModule,
    RouterModule,
    TagModule,
  ],
  exports: [UserStatusComponent],
})
export class ViewAllUserModule {}
