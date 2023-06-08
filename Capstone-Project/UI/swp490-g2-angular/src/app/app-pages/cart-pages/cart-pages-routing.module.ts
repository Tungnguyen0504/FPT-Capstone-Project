import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: "order-information",
    loadChildren: () =>
      import("./order-information/order-information.module").then(
        (m) => m.OrderInformationModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CartPagesRoutingModule { }
