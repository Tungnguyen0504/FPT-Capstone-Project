import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AdminClient, AdminPagesSummary } from "src/app/ngswag/client";

@Component({
  selector: "app-admin-pages",
  templateUrl: "./admin-pages.component.html",
})
export class AdminPagesComponent implements OnInit {
  buttonContents: ButtonContent[] = [];
  summary: AdminPagesSummary = new AdminPagesSummary();

  constructor(private $router: Router, private $adminClient: AdminClient) {
    this.initButtonContents();
  }

  ngOnInit(): void {
    this.$adminClient.adminPages_getSummary().subscribe((summary) => {
      console.log(summary);
      this.summary = summary;
    });
  }

  private initButtonContents(): void {
    const colors = ["red", "green", "blue"];
    this.buttonContents = [
      {
        title: "User Management",
        routerLink: "view-all-user",
        iconClass: "pi-users",
      },
      {
        title: "Restaurant Management",
        routerLink: "view-all-restaurant",
        iconClass: "pi-bars",
      },
      {
        title: "Restaurant Opening Request Management",
        routerLink: "request-open-list",
        iconClass: "pi-list",
      },
    ];

    this.buttonContents.map((buttonContent, index) => {
      buttonContent.color = colors[index % 3];
    });
  }

  isParentPage() {
    return this.$router.url === "/admin-pages";
  }
}

interface ButtonContent {
  title?: string;
  color?: string;
  routerLink?: string;
  iconClass?: string;
}
