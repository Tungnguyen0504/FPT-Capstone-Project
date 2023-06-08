import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { OrderManagementComponent } from "./order-management.component";

const routes: Routes = [{ path: "", component: OrderManagementComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderManagementRoutingModule { }
