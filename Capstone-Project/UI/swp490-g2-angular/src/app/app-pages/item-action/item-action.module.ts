import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ItemActionRoutingModule } from "./item-action-routing.module";
import { ItemActionComponent } from "./item-action.component";


@NgModule({
  declarations: [
    ItemActionComponent
  ],
  imports: [
    CommonModule,
    ItemActionRoutingModule
  ]
})
export class ItemActionModule { }
