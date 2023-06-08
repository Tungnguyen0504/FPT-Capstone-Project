import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { RequestOpenListRoutingModule } from "./request-open-list-routing.module";
import { RequestOpenListComponent } from "./request-open-list.component";
import { TableModule } from "primeng/table";
import { DropdownModule } from "primeng/dropdown";
import { FormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { RequestingStatusComponent } from "./requesting-status/requesting-status.component";
import { TagModule } from "primeng/tag";

@NgModule({
  declarations: [RequestOpenListComponent, RequestingStatusComponent],
  imports: [
    CommonModule,
    RequestOpenListRoutingModule,
    TableModule,
    DropdownModule,
    FormsModule,
    ButtonModule,
    TagModule,
  ],
  exports: [RequestingStatusComponent],
})
export class RequestOpenListModule {}
