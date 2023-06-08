import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ViewRestaurantDetailsRoutingModule } from "./view-restaurant-details-routing.module";
import { ViewRestaurantDetailsComponent } from "./view-restaurant-details.component";
import { ViewAllRestaurantModule } from "src/app/app-pages/admin-pages/view-all-restaurant/view-all-restaurant.module";
import { FormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { DropdownModule } from "primeng/dropdown";
import { TableModule } from "primeng/table";
import { TabMenuModule } from "primeng/tabmenu";
import { TagModule } from "primeng/tag";
import { ImageAttachmentModule } from "src/app/shared/image-attachment/image-attachment.module";
import { DialogModule } from "primeng/dialog";

@NgModule({
  declarations: [ViewRestaurantDetailsComponent],
  imports: [
    CommonModule,
    ViewRestaurantDetailsRoutingModule,
    TableModule,
    DropdownModule,
    FormsModule,
    ButtonModule,
    TagModule,
    TabMenuModule,
    FormsModule,
    ButtonModule,
    ViewAllRestaurantModule,
    ImageAttachmentModule,
    DialogModule,
  ],
})
export class ViewRestaurantDetailsModule {}
