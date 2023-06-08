import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { UpdateAvatarCoverComponent } from "./update-avatar-cover.component";

const routes: Routes = [{ path: "", component: UpdateAvatarCoverComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UpdateAvatarCoverRoutingModule { }
