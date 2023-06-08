import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ImageAttachmentComponent } from "./image-attachment.component";
import { DialogModule } from "primeng/dialog";
import { ButtonModule } from "primeng/button";
import { FileUploadModule } from "primeng/fileupload";
import { AccordionModule } from "primeng/accordion";



@NgModule({
  declarations: [
    ImageAttachmentComponent
  ],
  imports: [
    CommonModule,
    DialogModule,
    ButtonModule,
    FileUploadModule,
    AccordionModule,
  ],
  exports: [
    ImageAttachmentComponent,
  ]
})
export class ImageAttachmentModule { }
