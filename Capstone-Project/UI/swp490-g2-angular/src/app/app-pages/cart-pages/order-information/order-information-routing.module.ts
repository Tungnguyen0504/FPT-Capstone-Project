import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { OrderInformationComponent } from "./order-information.component";

const routes: Routes = [{ path: "", component: OrderInformationComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderInformationRoutingModule { }
