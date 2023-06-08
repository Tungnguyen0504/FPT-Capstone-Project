import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { RestaurantRoutingModule } from "./restaurant-routing.module";
import { RestaurantComponent } from "./restaurant.component";
import { BadgeModule } from "primeng/badge";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { InputTextareaModule } from "primeng/inputtextarea";
import { MenuModule } from "primeng/menu";
import { RippleModule } from "primeng/ripple";
import { StyleClassModule } from "primeng/styleclass";
import { FormsModule } from "@angular/forms";
import { CheckboxModule } from "primeng/checkbox";
import { DividerModule } from "primeng/divider";
import { DropdownModule } from "primeng/dropdown";
import { MultiSelectModule } from "primeng/multiselect";
import { ToggleButtonModule } from "primeng/togglebutton";
import { SliderModule } from "primeng/slider";
import { AccordionModule } from "primeng/accordion";
import { InputNumberModule } from "primeng/inputnumber";
import { ChipModule } from "primeng/chip";
import { GalleriaModule } from "primeng/galleria";
import { ImageAttachmentModule } from "src/app/shared/image-attachment/image-attachment.module";
import { ToastModule } from "primeng/toast";
import { ProductListComponent } from "./product-list/product-list.component";
import { RestaurantNameComponent } from "./restaurant-name/restaurant-name.component";
import { DialogModule } from "primeng/dialog";
import { RestaurantUpdateInformationComponent } from "./restaurant-update-information/restaurant-update-information.component";
import { SortByComponent } from "./sort-by/sort-by.component";
import { RadioButtonModule } from "primeng/radiobutton";
import { AccountInformationModule } from "../account-information/account-information.module";
import { InputSwitchModule } from "primeng/inputswitch";
import { CarouselModule } from "primeng/carousel";
import { CalendarModule } from "primeng/calendar";
import { TagModule } from "primeng/tag";
import { OpenClosedTimeModule } from "./open-closed-time/open-closed-time.module";
import { RatingModule } from "primeng/rating";
import { ProgressBarModule } from "primeng/progressbar";
import { PaginatorModule } from "primeng/paginator";
import { AddressFieldsModule } from "../account-information/address-fields/address-fields.module";

@NgModule({
  declarations: [
    RestaurantComponent,
    ProductListComponent,
    RestaurantNameComponent,
    RestaurantUpdateInformationComponent,
    SortByComponent,
  ],
  imports: [
    CommonModule,
    RestaurantRoutingModule,
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
    AccountInformationModule,
    CarouselModule,
    InputSwitchModule,
    CalendarModule,
    TagModule,
    OpenClosedTimeModule,
    RatingModule,
    ProgressBarModule,
    PaginatorModule,
    ToggleButtonModule,
    AddressFieldsModule,
  ],
})
export class RestaurantModule {}
