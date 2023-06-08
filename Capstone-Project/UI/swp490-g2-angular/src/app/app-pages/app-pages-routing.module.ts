import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "../global/auth.guard";
import { AppPagesComponent } from "./app-pages.component";

const routes: Routes = [
  {
    path: "",
    component: AppPagesComponent,
    children: [
      {
        path: "",
        loadChildren: () =>
          import("./home-page/home-page.module").then((m) => m.HomePageModule),
      },
      {
        path: "restaurant",
        loadChildren: () =>
          import("./restaurant/restaurant.module").then(
            (m) => m.RestaurantModule
          ),
      },
      {
        path: "account-information",
        loadChildren: () =>
          import("./account-information/account-information.module").then(
            (m) => m.AccountInformationModule
          ),
      },
      {
        path: "change-password",
        loadChildren: () =>
          import("../authentication-pages/change-password/change-password.module").then(
            (m) => m.ChangePasswordModule
          ),
      },
      {
        path: "admin-pages",
        loadChildren: () =>
          import("./admin-pages/admin-pages.module").then(
            (m) => m.AdminPagesModule
          ),
        canActivate: [AuthGuard],
        data: {
          roles: ["ADMIN"],
        },
      },
      {
        path: "seller-pages",
        loadChildren: () =>
          import("./seller-pages/seller-pages.module").then(
            (m) => m.SellerPagesModule
          ),
        canActivate: [AuthGuard],
        data: {
          roles: ["SELLER"],
        },
      },
      {
        path: "feed-page",
        loadChildren: () =>
          import("./feed-page/feed-page.module").then((m) => m.FeedPageModule),
      },
      {
        path: "restaurants",
        loadChildren: () =>
          import("./restaurants/restaurants.module").then(
            (m) => m.RestaurantsModule
          ),
      },
      {
        path: "item-action",
        loadChildren: () =>
          import("./item-action/item-action.module").then(
            (m) => m.ItemActionModule
          ),
      },
      {
        path: "seller-info",
        loadChildren: () =>
          import("./seller-info/seller-info.module").then(
            (m) => m.SellerInfoModule
          ),
      },
      {
        path: "order-management",
        loadChildren: () =>
          import("./order-management/order-management.module").then(
            (m) => m.OrderManagementModule
          ),
      },
      {
        path: "buyer-orders",
        loadChildren: () =>
          import("./buyer-orders/buyer-orders.module").then(
            (m) => m.BuyerOrdersModule
          ),
      },
      {
        path: "cart-pages",
        loadChildren: () =>
          import("./cart-pages/cart-pages.module").then(
            (m) => m.CartPagesModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppPagesRoutingModule {}
