import { ErrorHandler, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { UpdateAvatarCoverRoutingModule } from "./update-avatar-cover-routing.module";
import { UpdateAvatarCoverComponent } from "./update-avatar-cover.component";
import { HttpClientModule } from "@angular/common/http";
import { ButtonModule } from "primeng/button";
import { FileUploadModule } from "primeng/fileupload";
import { ToastModule } from "primeng/toast";
import { HttpErrorHandler } from "src/app/global/http-error-handler";


@NgModule({
  declarations: [
    UpdateAvatarCoverComponent
  ],
  imports: [
    CommonModule,
    UpdateAvatarCoverRoutingModule,
    FileUploadModule,
    HttpClientModule,
    ToastModule,
    ButtonModule
  ],
  providers: [
    {
      // processes all errors
      provide: ErrorHandler,
      useClass: HttpErrorHandler,
    },
  ],
})
export class UpdateAvatarCoverModule { }
