import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { AddItemRoutingModule } from "./add-item-routing.module";
import { AddItemComponent } from "./add-item.component";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { CalendarModule } from "primeng/calendar";
import { CheckboxModule } from "primeng/checkbox";
import { DropdownModule } from "primeng/dropdown";
import { FileUploadModule } from "primeng/fileupload";
import { InputTextModule } from "primeng/inputtext";
import { InputTextareaModule } from "primeng/inputtextarea";
import { RadioButtonModule } from "primeng/radiobutton";
import { ToastModule } from "primeng/toast";


@NgModule({
  declarations: [
    AddItemComponent
  ],
  imports: [
    CommonModule,
    AddItemRoutingModule,
    ButtonModule,
    CheckboxModule,
    RadioButtonModule,
    FormsModule,
    InputTextModule,
    InputTextareaModule,
    CalendarModule,
    FileUploadModule,
    HttpClientModule,
    ToastModule,
    DropdownModule
  ]
})
export class AddItemModule { }
