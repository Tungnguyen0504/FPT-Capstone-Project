import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AppPagesRoutingModule } from "./app-pages/app-pages-routing.module";

const routes: Routes = [
  {
    path: "auth",
    loadChildren: () =>
      import("./authentication-pages/authentication-pages.module").then(
        (m) => m.AuthenticationPagesModule
      ),
  },
  {
    path: "",
    loadChildren: () =>
      import("./app-pages/app-pages.module").then((m) => m.AppPagesModule),
  },
  {
    path: "seller-pages",
    loadChildren: () =>
      import("./app-pages/seller-pages/seller-pages.module").then(
        (m) => m.SellerPagesModule
      ),
  },
  {
    path: "seller-pages",
    loadChildren: () =>
      import("./app-pages/seller-pages/seller-pages.module").then(
        (m) => m.SellerPagesModule
      ),
  },
  {
    path: "**",
    redirectTo: "",
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { onSameUrlNavigation: "reload" }),
    AppPagesRoutingModule,
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
