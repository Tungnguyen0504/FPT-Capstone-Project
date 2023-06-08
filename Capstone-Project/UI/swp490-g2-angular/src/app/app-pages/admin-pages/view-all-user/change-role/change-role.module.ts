import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ChangeRoleRoutingModule } from "./change-role-routing.module";
import { ChangeRoleComponent } from "./change-role.component";
import { RadioButtonModule } from "primeng/radiobutton";
import { FormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { CheckboxModule } from "primeng/checkbox";
import { DialogModule } from "primeng/dialog";
import { RestaurantsModule } from "src/app/app-pages/restaurants/restaurants.module";
import { AccordionModule } from "primeng/accordion";

@NgModule({
  declarations: [ChangeRoleComponent],
  imports: [
    CommonModule,
    ChangeRoleRoutingModule,
    RadioButtonModule,
    FormsModule,
    ButtonModule,
    CheckboxModule,
    DialogModule,
    RestaurantsModule,
    AccordionModule
  ],
})
export class ChangeRoleModule {}
