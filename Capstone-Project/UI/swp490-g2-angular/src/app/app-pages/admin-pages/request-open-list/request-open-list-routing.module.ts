import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { RequestOpenListComponent } from "./request-open-list.component";

const routes: Routes = [
  { path: "", component: RequestOpenListComponent },
  {
    path: "request-open-details",
    loadChildren: () =>
      import("./request-open-details/request-open-details.module").then(
        (m) => m.RequestOpenDetailsModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RequestOpenListRoutingModule {}
