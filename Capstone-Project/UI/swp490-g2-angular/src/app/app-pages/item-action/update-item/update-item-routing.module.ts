import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { UpdateItemComponent } from "./update-item.component";

const routes: Routes = [{ path: "", component: UpdateItemComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UpdateItemRoutingModule { }
