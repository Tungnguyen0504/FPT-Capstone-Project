import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { AuthenticationPagesRoutingModule } from "./authentication-pages-routing.module";
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
import { LoginComponent } from "./login-page/login.component";
import { RegisterComponent } from "./register-page/register.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CodeValidatorComponent } from "./register-page/code-validator/code-validator.component";
import { ForgotPassPageModule } from "./forgot-pass-page/forgot-pass-page.module";
import { PasswordFieldsModule } from "./register-page/password-fields/password-fields.module";


@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    CodeValidatorComponent,
  ],
  imports: [
    CommonModule,
    AuthenticationPagesRoutingModule,
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
    ForgotPassPageModule,
    PasswordFieldsModule
  ],
  providers: [
  ]
})
export class AuthenticationPagesModule { }
