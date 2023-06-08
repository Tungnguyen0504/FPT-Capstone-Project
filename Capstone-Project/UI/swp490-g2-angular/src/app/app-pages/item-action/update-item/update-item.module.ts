import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UpdateItemRoutingModule } from "./update-item-routing.module";
import { UpdateItemComponent } from "./update-item.component";
import { ButtonModule } from "primeng/button";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { CalendarModule } from "primeng/calendar";
import { CheckboxModule } from "primeng/checkbox";
import { FileUploadModule } from "primeng/fileupload";
import { InputTextModule } from "primeng/inputtext";
import { InputTextareaModule } from "primeng/inputtextarea";
import { RadioButtonModule } from "primeng/radiobutton";
import { ToastModule } from "primeng/toast";
import { DropdownModule } from "primeng/dropdown";
import { DialogModule } from "primeng/dialog";


@NgModule({
  declarations: [
    UpdateItemComponent
  ],
  imports: [
    CommonModule,
    UpdateItemRoutingModule,
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
    DropdownModule,
    DialogModule,
  ]
})
export class UpdateItemModule { }
