import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { BuyerOrdersComponent } from "./buyer-orders.component";

const routes: Routes = [
  {
    path: "",
    component: BuyerOrdersComponent,
    runGuardsAndResolvers: "always",
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BuyerOrdersRoutingModule {}
