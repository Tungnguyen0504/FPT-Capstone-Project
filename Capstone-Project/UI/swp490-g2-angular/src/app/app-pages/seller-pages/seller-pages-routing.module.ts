import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SellerPagesComponent } from "./seller-pages.component";

const routes: Routes = [{ path: "", component: SellerPagesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SellerPagesRoutingModule { }
