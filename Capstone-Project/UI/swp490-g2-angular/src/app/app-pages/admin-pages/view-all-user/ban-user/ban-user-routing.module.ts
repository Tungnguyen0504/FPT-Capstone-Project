import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { BanUserComponent } from "./ban-user.component";

const routes: Routes = [{ path: ":id", component: BanUserComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BanUserRoutingModule {}
