import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { RestaurantComponent } from "./restaurant.component";

const routes: Routes = [
  {
    path: ":id",
    children: [
      {
        path: "",
        component: RestaurantComponent,
      },
      {
        path: "product",
        loadChildren: () =>
          import("./product/product.module").then((m) => m.ProductModule),
      },
      {
        path: "add-product",
        loadChildren: () =>
          import("./add-product/add-product.module").then(
            (m) => m.AddProductModule
          ),
      },
      {
        path: "statistic",
        loadChildren: () =>
          import("./chart-revenue/chart-revenue.module").then(
            (m) => m.ChartRevenueModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RestaurantRoutingModule {}
