import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MenubarModule } from "primeng/menubar";
import { InputTextModule } from "primeng/inputtext";
import { TabViewModule } from "primeng/tabview";
import { ContextMenuModule } from "primeng/contextmenu";
import { NavbarComponent } from "./navbar.component";
import { RippleModule } from "primeng/ripple";
import { BadgeModule } from "primeng/badge";
import { StyleClassModule } from "primeng/styleclass";
import { SidebarModule } from "primeng/sidebar";
import { ButtonModule } from "primeng/button";
import { SideBarsModule } from "../side-bars/side-bars.module";
import { CartPagesModule } from "src/app/app-pages/cart-pages/cart-pages.module";
import { NotificationsComponent } from "./notifications/notifications.component";
import { OverlayPanelModule } from "primeng/overlaypanel";

@NgModule({
  declarations: [NavbarComponent, NotificationsComponent],
  exports: [NavbarComponent],
  imports: [
    CommonModule,
    MenubarModule,
    InputTextModule,
    TabViewModule,
    ContextMenuModule,
    RippleModule,
    BadgeModule,
    StyleClassModule,
    SidebarModule,
    ButtonModule,
    SideBarsModule,
    CartPagesModule,
    OverlayPanelModule,
  ],
})
export class NavbarModule { }
