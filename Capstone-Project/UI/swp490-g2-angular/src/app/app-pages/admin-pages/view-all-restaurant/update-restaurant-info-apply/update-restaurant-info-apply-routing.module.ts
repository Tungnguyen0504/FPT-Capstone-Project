import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { UpdateRestaurantInfoApplyComponent } from "./update-restaurant-info-apply.component";

const routes: Routes = [
  { path: ":id", component: UpdateRestaurantInfoApplyComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UpdateRestaurantInfoApplyRoutingModule { }
