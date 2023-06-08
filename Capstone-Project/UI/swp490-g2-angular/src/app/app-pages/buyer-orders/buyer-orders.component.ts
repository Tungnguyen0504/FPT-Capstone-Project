import { Component } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { Router } from "@angular/router";

@Component({
  selector: "app-buyer-orders",
  templateUrl: "./buyer-orders.component.html",
  styleUrls: ["./buyer-orders.component.scss"],
})
export class BuyerOrdersComponent {
  navigationSubscription: any;

  constructor($title: Title, private $router: Router) {
    $title.setTitle("Buyer Orders");
  }
}
