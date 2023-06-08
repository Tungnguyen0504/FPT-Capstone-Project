import { Component, Input } from "@angular/core";
import { MessageService } from "primeng/api";
import { finalize, map } from "rxjs";
import { Restaurant, RestaurantClient } from "src/app/ngswag/client";

@Component({
  selector: "app-restaurant-name",
  templateUrl: "./restaurant-name.component.html",
  styleUrls: ["./restaurant-name.component.scss"],
})
export class RestaurantNameComponent {
  @Input() restaurant: Restaurant;
  @Input() editable: boolean;
  isEditing = false;

  constructor(
    private $restaurantClient: RestaurantClient,
    private $message: MessageService
  ) {}

  onButtonClick() {
    if (!this.isEditing) {
      this.isEditing = true;
    } else {
      this.isEditing = false;
      if (this.restaurant.restaurantName?.length === 0) return;

      this.$restaurantClient
        .update(this.restaurant)
        .pipe(
          map((errorMessage) => {
            if (errorMessage) throw new Error(errorMessage);

            this.$message.add({
              severity: "success",
              summary: "Success",
              detail: `Restaurant's name has changed to "${this.restaurant.restaurantName}"`,
            });
          }),
          finalize(() => {
            this.$restaurantClient
              .getById(this.restaurant.id!)
              .pipe(map((restaurant) => (this.restaurant = restaurant)))
              .subscribe();
          })
        )
        .subscribe();
    }
  }
}
