import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { of, switchMap } from "rxjs";
import { AuthService } from "src/app/global/auth.service";
import {
  AdminClient,
  File,
  Restaurant,
  User,
  UserClient,
} from "src/app/ngswag/client";
import { DateUtils, getFullAddress } from "src/app/utils";

@Component({
  selector: "app-view-restaurant-details",
  templateUrl: "./view-restaurant-details.component.html",
})
export class ViewRestaurantDetailsComponent implements OnInit {
  ngOnInit(): void {}
  restaurantId: number;
  restaurant?: Restaurant;
  uploadUrl: string;
  user?: User;
  restaurants: Restaurant[] = [];

  constructor(
    private $adminClient: AdminClient,
    private $route: ActivatedRoute,
    private $auth: AuthService,
    private $userClient: UserClient
  ) {
    const id: number = Number.parseInt(
      <string>this.$route.snapshot.paramMap.get("id")
    );
    this.uploadUrl = "restaurant/update-avatar/" + id;

    this.restaurantId = id;
    this.refresh();
  }

  refresh() {
    this.$adminClient
      .getRestaurantById(this.restaurantId)
      .pipe(
        switchMap((restaurant) => {
          this.restaurant = restaurant;
          if (restaurant.id) {
            return this.$userClient.getAllOwnersByRestaurantIds([
              restaurant.id,
            ]);
          } else return of(undefined);
        })
      )
      .subscribe((owners) => {
        if (owners) {
          (this.restaurant as any).owners = owners;
        }
      });

    this.$auth.getCurrentUser().subscribe((user) => (this.user = user));

    this.$adminClient
      .getRestaurantById(this.restaurantId)
      .subscribe((restaurant) => {
        this.restaurant = restaurant;
        this.restaurant.createdAt = DateUtils.fromDB(this.restaurant.createdAt);
      });
  }

  get fullAddress(): string {
    return getFullAddress(this.restaurant?.address);
  }

  updateAvatar(image: File) {
    if (!this.restaurant) return;

    this.restaurant.avatarFile = image;
    this.$adminClient
      .updateRestaurant(this.restaurant)
      .subscribe(() => location.reload());
  }

  getOwners(restaurant: Restaurant): string {
    if (!(restaurant as any).owners) return "";

    return (restaurant as any).owners.map((o) => o.email).join(", ");
  }

  getDeactivateReasons(): string[] {
    if (!this.restaurant?.deactivateReasons) return [];

    return JSON.parse(this.restaurant?.deactivateReasons);
  }
}
