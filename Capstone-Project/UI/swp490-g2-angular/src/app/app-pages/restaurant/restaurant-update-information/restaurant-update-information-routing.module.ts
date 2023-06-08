import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { RestaurantUpdateInformationComponent } from "./restaurant-update-information.component";

const routes: Routes = [{ path: "", component: RestaurantUpdateInformationComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RestaurantUpdateInformationRoutingModule { }
