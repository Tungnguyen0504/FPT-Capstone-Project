import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { RequestOpenDetailsComponent } from "./request-open-details.component";

const routes: Routes = [
  { path: ":id", component: RequestOpenDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RequestOpenDetailsRoutingModule {}
