import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PasswordFieldsComponent } from "./password-fields.component";
import { InputTextModule } from "primeng/inputtext";
import { FormsModule } from "@angular/forms";

@NgModule({
  imports: [CommonModule, InputTextModule, FormsModule],
  declarations: [PasswordFieldsComponent],
  exports: [PasswordFieldsComponent],
})
export class PasswordFieldsModule {}
