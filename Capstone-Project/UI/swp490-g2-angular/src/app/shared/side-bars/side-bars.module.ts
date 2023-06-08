import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SideBarsComponent } from "./side-bars.component";

@NgModule({
  declarations: [SideBarsComponent],
  imports: [CommonModule],
  exports: [SideBarsComponent],
})
export class SideBarsModule {}
