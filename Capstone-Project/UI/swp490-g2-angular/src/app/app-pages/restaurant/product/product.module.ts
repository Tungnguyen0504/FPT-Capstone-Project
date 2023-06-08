import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ProductRoutingModule } from "./product-routing.module";
import { ProductComponent } from "./product.component";
import { ImageAttachmentModule } from "src/app/shared/image-attachment/image-attachment.module";
import { ButtonModule } from "primeng/button";
import { RippleModule } from "primeng/ripple";
import { FormsModule } from "@angular/forms";
import { InputTextModule } from "primeng/inputtext";
import { ToastModule } from "primeng/toast";
import { InputTextareaModule } from "primeng/inputtextarea";
import { InputNumberModule } from "primeng/inputnumber";
import { ChipsModule } from "primeng/chips";
import { RadioButtonModule } from "primeng/radiobutton";
import { ChipModule } from "primeng/chip";
import { DragDropModule } from "primeng/dragdrop";


@NgModule({
  declarations: [ProductComponent],
  imports: [
    CommonModule,
    ProductRoutingModule,
    ImageAttachmentModule,
    ButtonModule,
    RippleModule,
    FormsModule,
    InputTextModule,
    ToastModule,
    InputTextareaModule,
    InputNumberModule,
    ChipsModule,
    RadioButtonModule,
    ChipModule,
    DragDropModule,
  ],
  providers: [
  ]
})
export class ProductModule { }
