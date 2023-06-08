import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ItemActionComponent } from "./item-action.component";

const routes: Routes = [{ path: "", component: ItemActionComponent },
{ path: "update-item", loadChildren: () => import("./update-item/update-item.module").then(m => m.UpdateItemModule) },
{ path: "add-item", loadChildren: () => import("./add-item/add-item.module").then(m => m.AddItemModule) }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItemActionRoutingModule { }
