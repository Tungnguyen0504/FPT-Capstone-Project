import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { OrderManagementComponent } from "./order-management.component";
import { OrderManagementRoutingModule } from "./order-management-routing.module";
import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { TagModule } from "primeng/tag";
import { DialogModule } from "primeng/dialog";
import { CardModule } from "primeng/card";
import { ImageAttachmentModule } from "src/app/shared/image-attachment/image-attachment.module";
import { DividerModule } from "primeng/divider";
import { InputTextareaModule } from "primeng/inputtextarea";
import { DropdownModule } from "primeng/dropdown";

@NgModule({
  imports: [
    CommonModule,
    OrderManagementRoutingModule,
    TableModule,
    ButtonModule,
    TagModule,
    DialogModule,
    CardModule,
    ImageAttachmentModule,
    DividerModule,
    InputTextareaModule,
    FormsModule,
    DropdownModule
  ],
  declarations: [OrderManagementComponent],
  exports: [OrderManagementComponent],
})
export class OrderManagementModule {}
