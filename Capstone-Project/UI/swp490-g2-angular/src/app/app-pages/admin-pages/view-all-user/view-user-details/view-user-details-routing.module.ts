import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ViewUserDetailsComponent } from "./view-user-details.component";

const routes: Routes = [{ path: ":id", component: ViewUserDetailsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewUserDetailsRoutingModule {}
