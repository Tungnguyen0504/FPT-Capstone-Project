import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { AppPagesRoutingModule } from "./app-pages-routing.module";
import { AppPagesComponent } from "./app-pages.component";
import { NavbarModule } from "../shared/navbar/navbar.module";
import { FooterModule } from "../shared/footer/footer.module";
import { HomePageModule } from "./home-page/home-page.module";
import { RestaurantModule } from "./restaurant/restaurant.module";
import { AccountInformationModule } from "./account-information/account-information.module";
import { CartPagesModule } from "./cart-pages/cart-pages.module";
import { ToastModule } from "primeng/toast";

@NgModule({
  declarations: [AppPagesComponent],
  imports: [
    CommonModule,
    AppPagesRoutingModule,
    NavbarModule,
    FooterModule,
    HomePageModule,
    RestaurantModule,
    AccountInformationModule,
    CartPagesModule,
    ToastModule,
  ],
  bootstrap: [AppPagesComponent],
})
export class AppPagesModule {}
