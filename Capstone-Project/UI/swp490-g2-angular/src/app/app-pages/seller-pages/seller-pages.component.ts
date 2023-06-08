import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from "@angular/core";
import { NgForm } from "@angular/forms";
import { Title } from "@angular/platform-browser";
import { ConfirmationService } from "primeng/api";
import {
  User,
  Restaurant,
  BuyerClient,
  UserClient,
} from "src/app/ngswag/client";

@Component({
  selector: "app-seller-pages",
  templateUrl: "./seller-pages.component.html",
})
export class SellerPagesComponent implements OnInit, AfterViewInit {
  @ViewChild("form", { static: false }) form!: NgForm;
  @Input()
  display = false;
  user?: User;
  restaurants: Restaurant[];

  ngOnInit(): void {
    this.$userClient.getCurrentUser().subscribe((user) => (this.user = user));
  }
  ngAfterViewInit(): void {}

  constructor(
    $title: Title,
    private $confirmation: ConfirmationService,
    private $buyerClient: BuyerClient,
    private $userClient: UserClient
  ) {
    $title.setTitle("Seller Management");
  }
}
