import { Component, Input } from "@angular/core";
import { User } from "src/app/ngswag/client";

@Component({
  selector: "app-user-status",
  templateUrl: "./user-status.component.html",
  styleUrls: ["./user-status.component.scss"],
})
export class UserStatusComponent {
  @Input() user?: User;

  get statusObject():
    | {
        text: string;
        severity: "success" | "danger";
      }
    | undefined {
    switch (this.user?.userStatus) {
      case "ACTIVE":
        return {
          text: "Active",
          severity: "success",
        };

      case "INACTIVE":
        return {
          text: "Inactive",
          severity: "danger",
        };

      case "BANNED":
        return {
          text: "Banned",
          severity: "danger",
        };
    }

    return undefined;
  }
}
