import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ForgotPassPageComponent } from "./forgot-pass-page.component";
import { ButtonModule } from "primeng/button";
import { CarouselModule } from "primeng/carousel";
import { CheckboxModule } from "primeng/checkbox";
import { DividerModule } from "primeng/divider";
import { InputTextModule } from "primeng/inputtext";
import { RippleModule } from "primeng/ripple";
import { StyleClassModule } from "primeng/styleclass";
import { MessageModule } from "primeng/message";
import { ToastModule } from "primeng/toast";
import { DialogModule } from "primeng/dialog";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { PasswordFieldsModule } from "../register-page/password-fields/password-fields.module";

@NgModule({
  imports: [
    CommonModule,
    StyleClassModule,
    InputTextModule,
    ButtonModule,
    CarouselModule,
    DividerModule,
    RippleModule,
    CheckboxModule,
    FormsModule,
    MessageModule,
    ToastModule,
    DialogModule,
    ReactiveFormsModule,
    PasswordFieldsModule
  ],
  declarations: [ForgotPassPageComponent],
  exports: [ForgotPassPageComponent]
})
export class ForgotPassPageModule { }
