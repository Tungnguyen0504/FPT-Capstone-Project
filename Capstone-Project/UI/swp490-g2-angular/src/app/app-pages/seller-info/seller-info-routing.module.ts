import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
{ path: "update-info", loadChildren: () => import("./update-info/update-info.module").then(m => m.UpdateInfoModule) },
{ path: "update-avatar-cover", loadChildren: () => import("./update-avatar-cover/update-avatar-cover.module").then(m => m.UpdateAvatarCoverModule) }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SellerInfoRoutingModule { }
