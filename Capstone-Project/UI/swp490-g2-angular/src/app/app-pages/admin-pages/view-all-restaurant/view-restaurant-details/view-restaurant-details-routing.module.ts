import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ViewRestaurantDetailsComponent } from "./view-restaurant-details.component";

const routes: Routes = [
  { path: ":id", component: ViewRestaurantDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewRestaurantDetailsRoutingModule { }
