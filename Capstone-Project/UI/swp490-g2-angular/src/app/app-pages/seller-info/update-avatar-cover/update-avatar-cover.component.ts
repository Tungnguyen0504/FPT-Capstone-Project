import { Component } from "@angular/core";
import { MessageService } from "primeng/api";

@Component({
  selector: "app-update-avatar-cover",
  templateUrl: "./update-avatar-cover.component.html"
})
export class UpdateAvatarCoverComponent {
  uploadedFiles: any[] = [];

  constructor(private messageService: MessageService) {}

  onUpload(event) {
    for (const file of event.files) {
      this.uploadedFiles.push(file);
    }

    this.messageService.add({
      severity: "info",
      summary: "File Uploaded",
      detail: "",
    });
  }
}
