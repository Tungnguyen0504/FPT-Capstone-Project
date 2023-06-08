import { Component, OnInit, ViewChild } from "@angular/core";
import { PrimeNGConfig } from "primeng/api";
import { OverlayPanel } from "primeng/overlaypanel";
import { UserClient, User } from "./ngswag/client";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  title = "swp490-g2-angular";
  adminContactsLabel: "Admin Contacts" | "" = "";
  @ViewChild("contactOP") contactOP: OverlayPanel;
  admins: User[] = [];

  constructor(
    private primengConfig: PrimeNGConfig,
    private $userClient: UserClient
  ) {}

  ngOnInit() {
    this.primengConfig.ripple = true;
    this.$userClient
      .getAdminContacts()
      .subscribe((admins) => (this.admins = admins));
  }

  toggleContactOP(event: any, targetElement: any) {
    this.contactOP.toggle(event, targetElement);
  }
}
