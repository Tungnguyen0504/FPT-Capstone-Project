import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ImageAttachmentModule } from "src/app/shared/image-attachment/image-attachment.module";
import { ButtonModule } from "primeng/button";
import { RippleModule } from "primeng/ripple";
import { AddProductComponent } from "./add-product.component";
import { AddProductRoutingModule } from "./add-product-routing.module";
import { ReactiveFormsModule } from "@angular/forms";

@NgModule({
  declarations: [AddProductComponent],
  imports: [
    CommonModule,
    ImageAttachmentModule,
    ButtonModule,
    RippleModule,
    AddProductRoutingModule,
    ReactiveFormsModule
  ],
})
export class AddProductModule {}
