import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AddRestaurantInfoComponent } from "./add-restaurant-info.component";

const routes: Routes = [{ path: "", component: AddRestaurantInfoComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddRestaurantInfoRoutingModule { }
