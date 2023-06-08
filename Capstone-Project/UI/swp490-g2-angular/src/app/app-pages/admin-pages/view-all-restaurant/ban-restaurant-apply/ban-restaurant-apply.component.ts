import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-ban-restaurant-apply",
  templateUrl: "./ban-restaurant-apply.component.html",
})
export class BanRestaurantApplyComponent implements OnInit {
  selectedReason: string[] = [];
  checked = false;
  ngOnInit(): void {}
}
