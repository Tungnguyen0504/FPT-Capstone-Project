import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FooterComponent } from "./footer.component";
import { DividerModule } from "primeng/divider";


@NgModule({
  declarations: [FooterComponent],
  imports: [
    DividerModule,
    CommonModule
  ],
  exports: [FooterComponent]
})
export class FooterModule { }
