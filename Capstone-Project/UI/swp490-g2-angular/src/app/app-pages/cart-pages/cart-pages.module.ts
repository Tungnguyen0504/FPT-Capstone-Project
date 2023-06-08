import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { CartPagesComponent } from "./cart-pages.component";
import { CartPagesRoutingModule } from "./cart-pages-routing.module";
import { RippleModule } from "primeng/ripple";
import { ButtonModule } from "primeng/button";
import { StyleClassModule } from "primeng/styleclass";
import { CheckboxModule } from "primeng/checkbox";
import { FormsModule } from "@angular/forms";
import { InputNumberModule } from "primeng/inputnumber";
import { ImageAttachmentModule } from "src/app/shared/image-attachment/image-attachment.module";
import { ToastModule } from "primeng/toast";
import { BadgeModule } from "primeng/badge";
import { AccordionModule } from "primeng/accordion";
import { InputTextareaModule } from "primeng/inputtextarea";

@NgModule({
  declarations: [CartPagesComponent],
  imports: [
    CommonModule,
    CartPagesRoutingModule,
    ButtonModule,
    RippleModule,
    StyleClassModule,
    CheckboxModule,
    FormsModule,
    InputNumberModule,
    StyleClassModule,
    ButtonModule,
    InputNumberModule,
    RippleModule,
    CheckboxModule,
    StyleClassModule,
    ImageAttachmentModule,
    ToastModule,
    BadgeModule,
    AccordionModule,
    InputTextareaModule,
  ],
  exports: [CartPagesComponent],
})
export class CartPagesModule {}
