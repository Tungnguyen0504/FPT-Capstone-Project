import { Component } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService } from "src/app/global/auth.service";
import { Client } from "src/app/ngswag/client";

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"],
})
export class SidebarComponent {
  constructor(
    private $router: Router,
    private $route: ActivatedRoute,
    private $title: Title,
    private $auth: AuthService,
    private $client: Client
  ) {}
  // viewAllUsers() {
  //   this.$router.navigate(["admin-pages", "view-all-user"]);
  // }

  // viewAllRestaurants() {
  //   this.$router.navigate(["admin-pages", "view-all-restaurant"]);
  // }

  // viewAllRequest() {
  //   this.$router.navigate(["admin-pages", "request-open-list"]);
  // }
}
