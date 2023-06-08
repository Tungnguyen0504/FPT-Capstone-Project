import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ChartRevenueComponent } from "./chart-revenue.component";


const routes: Routes = [{ path: "", component: ChartRevenueComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChartRevenueRoutingModule { }
