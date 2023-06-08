import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { OpenClosedTimeComponent } from "./open-closed-time.component";
import { FormsModule } from "@angular/forms";
import { AccordionModule } from "primeng/accordion";
import { BadgeModule } from "primeng/badge";
import { ButtonModule } from "primeng/button";
import { CalendarModule } from "primeng/calendar";
import { CarouselModule } from "primeng/carousel";
import { CheckboxModule } from "primeng/checkbox";
import { ChipModule } from "primeng/chip";
import { DialogModule } from "primeng/dialog";
import { DividerModule } from "primeng/divider";
import { DropdownModule } from "primeng/dropdown";
import { GalleriaModule } from "primeng/galleria";
import { InputNumberModule } from "primeng/inputnumber";
import { InputSwitchModule } from "primeng/inputswitch";
import { InputTextModule } from "primeng/inputtext";
import { InputTextareaModule } from "primeng/inputtextarea";
import { MenuModule } from "primeng/menu";
import { MultiSelectModule } from "primeng/multiselect";
import { RadioButtonModule } from "primeng/radiobutton";
import { RippleModule } from "primeng/ripple";
import { SliderModule } from "primeng/slider";
import { StyleClassModule } from "primeng/styleclass";
import { TagModule } from "primeng/tag";
import { ToastModule } from "primeng/toast";
import { ToggleButtonModule } from "primeng/togglebutton";
import { ImageAttachmentModule } from "src/app/shared/image-attachment/image-attachment.module";



@NgModule({
  declarations: [
    OpenClosedTimeComponent
  ],
  imports: [
    CommonModule,
    InputTextModule,
    InputTextareaModule,
    BadgeModule,
    StyleClassModule,
    ButtonModule,
    RippleModule,
    MenuModule,
    DropdownModule,
    ChipModule,
    SliderModule,
    CheckboxModule,
    DividerModule,
    AccordionModule,
    ToggleButtonModule,
    FormsModule,
    InputNumberModule,
    MultiSelectModule,
    GalleriaModule,
    ImageAttachmentModule,
    ToastModule,
    DialogModule,
    RadioButtonModule,
    CarouselModule,
    InputSwitchModule,
    CalendarModule,
    TagModule,
  ],
  exports: [
    OpenClosedTimeComponent
  ]
})
export class OpenClosedTimeModule { }
