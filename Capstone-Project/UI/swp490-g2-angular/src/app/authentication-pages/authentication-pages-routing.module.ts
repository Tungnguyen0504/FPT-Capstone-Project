import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ForgotPassPageComponent } from "./forgot-pass-page/forgot-pass-page.component";
import { LoginComponent } from "./login-page/login.component";
import { RegisterComponent } from "./register-page/register.component";

const routes: Routes = [
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  { path: "forgot-password", component: ForgotPassPageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticationPagesRoutingModule { }
