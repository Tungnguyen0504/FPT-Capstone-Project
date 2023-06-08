import { Component, Input, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { Router, ActivatedRoute } from "@angular/router";
import { MenuItem } from "primeng/api";
import { AuthService } from "src/app/global/auth.service";
import { Client, Order, User } from "src/app/ngswag/client";
import { CartService } from "src/app/service/cart.service";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"],
})
export class NavbarComponent implements OnInit {
  // @Input: duoc truyen vao tu parent
  @Input() user?: User;
  sidebarVisible: boolean;

  order: Order;
  constructor(
    private $router: Router,
    private $route: ActivatedRoute,
    private $title: Title,
    private $auth: AuthService,
    private $client: Client,
    private cartService: CartService,
  ) {
    $title.setTitle("Home");
  }
  items!: MenuItem[];

  ngOnInit() {
    this.items = [];

    this.cartService.getOrderObservable().subscribe((order) => {
      this.order = order;
    });
  }
  getUserDisplay(): string {
    // Thoa man 2 dieu kien:
    // 1. this.user ton tai
    // 2. this.user.email ton tai
    if (this.userExisted()) {
      // if(this.user?.email)
      // this.user.email: string | undefined
      if (AuthService.isAdmin(this.user)) {
        return "Admin Account";
      }

      return <string>this.user?.email;
    }

    return "Account";
  }

  userExisted(): boolean {
    // !! giup ep kieu sang boolean
    return !!(this.user && this.user.email);
  }

  logOut(): void {
    this.cartService.clearCart();
    this.$auth.logout();
  }

  navToBuyerInformationSetting() {
    this.$router.navigate(["account-information"], { relativeTo: this.$route });
  }

  userExistedAdmin(): string {
    if (AuthService.isAdmin(this.user)) {
      return "Admin Account";
    }

    return "";
  }

  userExistedSeller(): string {
    if (AuthService.isSeller(this.user)) {
      return "Seller";
    }

    return "";
  }
}
