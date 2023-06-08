import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Restaurant, User } from "src/app/ngswag/client";
import { getFullAddress, haversineDistance } from "src/app/utils";

@Component({
  selector: "app-restaurant-card",
  templateUrl: "./restaurant-card.component.html",
  styleUrls: ["./restaurant-card.component.scss"],
})
export class RestaurantCardComponent {
  @Input() restaurant: Restaurant;
  @Input() currentUser?: User;
  @Input() hasDistance = true;
  @Output() restaurantNameClick = new EventEmitter<void>();

  getRestaurantDistance(restaurant: Restaurant): string {
    if (
      !restaurant.address?.lat ||
      !restaurant.address?.lng ||
      !this.currentUser?.address?.lat ||
      !this.currentUser.address.lng
    ) {
      return "";
    }

    const distance = haversineDistance(
      restaurant.address?.lat,
      restaurant.address?.lng,
      this.currentUser?.address?.lat,
      this.currentUser?.address?.lng
    );

    if (distance >= 1) return distance.toFixed(1) + " km";
    else return Math.round(distance * 1000) + " m";
  }

  getRestaurantCategories(restaurant: Restaurant): string {
    if (
      !restaurant.restaurantCategories ||
      restaurant.restaurantCategories.length === 0
    ) {
      return "No categories";
    }

    return restaurant.restaurantCategories
      ?.map((category) => category.restaurantCategoryName)
      .sort((a, b) => a!.localeCompare(b!))
      .join(", ");
  }

  getRestaurantFullAddress(restaurant: Restaurant): string {
    return getFullAddress(restaurant.address);
  }

  onRestaurantNameClick() {
    this.restaurantNameClick.emit();
  }
}
