import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MenubarModule } from "primeng/menubar";
import { InputTextModule } from "primeng/inputtext";
import { TabViewModule } from "primeng/tabview";
import { ContextMenuModule } from "primeng/contextmenu";
import { BadgeModule } from "primeng/badge";
import { MultiSelectModule } from "primeng/multiselect";
import { HomePageRoutingModule } from "./home-page-routing.module";
import { HomePageComponent } from "./home-page.component";
import { ButtonModule } from "primeng/button";
import { MenuModule } from "primeng/menu";
import { DividerModule } from "primeng/divider";
import { ToggleButtonModule } from "primeng/togglebutton";
import { FormsModule } from "@angular/forms";
import { CarouselModule } from "primeng/carousel";
import { ImageAttachmentModule } from "src/app/shared/image-attachment/image-attachment.module";
import { ChipsModule } from "primeng/chips";
import { TooltipModule } from "primeng/tooltip";
import { TagModule } from "primeng/tag";

@NgModule({
  declarations: [HomePageComponent],
  imports: [
    CommonModule,
    HomePageRoutingModule,
    ButtonModule,
    MenubarModule,
    InputTextModule,
    TabViewModule,
    ContextMenuModule,
    BadgeModule,
    MenuModule,
    DividerModule,
    MultiSelectModule,
    ToggleButtonModule,
    FormsModule,
    CarouselModule,
    ImageAttachmentModule,
    ChipsModule,
    TooltipModule,
    TagModule,
  ],
})
export class HomePageModule {}
