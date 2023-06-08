import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ViewAllUserComponent } from "./view-all-user.component";

const routes: Routes = [
  { path: "", component: ViewAllUserComponent },
  {
    path: "view-user-details",
    loadChildren: () =>
      import("./view-user-details/view-user-details.module").then(
        (m) => m.ViewUserDetailsModule
      ),
  },
  {
    path: "ban-user",
    loadChildren: () =>
      import("./ban-user/ban-user.module").then((m) => m.BanUserModule),
  },
  {
    path: "change-role",
    loadChildren: () =>
      import("./change-role/change-role.module").then(
        (m) => m.ChangeRoleModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewAllUserRoutingModule {}
