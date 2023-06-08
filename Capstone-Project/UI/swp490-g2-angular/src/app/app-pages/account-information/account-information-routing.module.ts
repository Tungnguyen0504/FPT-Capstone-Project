import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AccountInformationComponent } from "./account-information.component";
import { OpenRestaurantRequestComponent } from "./open-restaurant-request/open-restaurant-request.component";
// import { ListOfRestaurantsComponent } from './list-of-restaurants/list-of-restaurants.component';

const routes: Routes = [
  {
    path: "", component: AccountInformationComponent,
  },
  {
    path: "open-restaurant-request", component: OpenRestaurantRequestComponent,
  },
  // { path: 'list-of-restaurants', component: ListOfRestaurantsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BuyerInformationRoutingModule { }
