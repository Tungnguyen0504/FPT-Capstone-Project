import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { AdminPagesRoutingModule } from "./admin-pages-routing.module";
import { AdminPagesComponent } from "./admin-pages.component";
import { SidebarModule } from "./sidebar/sidebar.module";

@NgModule({
  declarations: [AdminPagesComponent],
  imports: [CommonModule, AdminPagesRoutingModule, SidebarModule],
})
export class AdminPagesModule {}
