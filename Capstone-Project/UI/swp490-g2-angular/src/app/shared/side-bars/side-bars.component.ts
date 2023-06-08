import { Component, Input, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { Router, ActivatedRoute } from "@angular/router";
import { MenuItem } from "primeng/api";
import { AuthService } from "src/app/global/auth.service";
import { Client, User } from "src/app/ngswag/client";

@Component({
  selector: "app-side-bars",
  templateUrl: "./side-bars.component.html",
  styleUrls: ["./side-bars.component.scss"],
})
export class SideBarsComponent implements OnInit {
  @Input() user?: User;
  sidebarVisible: boolean;

  constructor(
    private $router: Router,
    private $route: ActivatedRoute,
    private $title: Title,
    private $auth: AuthService,
    private $client: Client
  ) {
    $title.setTitle("Home");
  }
  items!: MenuItem[];

  ngOnInit() {
    this.items = [];
  }

  userExistedAdmin(): boolean {
    return AuthService.isAdmin(this.user);
  }

  navToHomePage() {
    this.$router.navigate([""], {
      relativeTo: this.$route,
    });
  }

  navToFeed() {
    this.$router.navigate(["feed-page"], {
      relativeTo: this.$route,
    });
  }

  navToSettings() {
    this.$router.navigate(["account-information"], {
      relativeTo: this.$route,
    });
  }

  navToNotifications() {
    this.$router.navigate(["navbar", "notifications"], {
      relativeTo: this.$route,
    });
  }

  navToRestaurant() {
    this.$router.navigate(["restaurants"], {
      relativeTo: this.$route,
    });
  }

  navToMyOrders() {
    this.$router.navigate(["buyer-orders"], {
      relativeTo: this.$route,
    });
  }

  viewAllUsers() {
    this.$router.navigate(["admin-pages", "view-all-user"], {
      relativeTo: this.$route,
    });
  }

  viewAllRestaurants() {
    this.$router.navigate(["admin-pages", "view-all-restaurant"], {
      relativeTo: this.$route,
    });
  }

  viewAllRequest() {
    this.$router.navigate(["admin-pages", "request-open-list"], {
      relativeTo: this.$route,
    });
  }

  showAdmin(): boolean {
    return !this.$router.url.startsWith("/admin-pages");
  }
}
