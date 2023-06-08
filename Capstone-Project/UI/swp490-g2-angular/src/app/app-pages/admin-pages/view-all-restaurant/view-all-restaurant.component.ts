import { Component, NgZone } from "@angular/core";
import { ConfirmationService, MessageService } from "primeng/api";
import { of, switchMap } from "rxjs";
import {
  AdminClient,
  Restaurant,
  RestaurantClient,
  SearchRestaurantsRequest,
} from "src/app/ngswag/client";

@Component({
  selector: "app-view-all-restaurant",
  templateUrl: "./view-all-restaurant.component.html",
  styleUrls: ["./view-all-restaurant.component.css"],
  providers: [MessageService],
})
export class ViewAllRestaurantComponent {
  statuses: any[];
  loading = true;
  activityValues: number[] = [0, 100];
  restaurants: Restaurant[] = [];
  deactivateDialogVisible = false;
  restaurant?: Restaurant;
  selectedDeactivateReasons: string[] = [];
  deactivateReasons: string[] = [
    "Restaurant is failed to obtain the necessary permits or licenses",
    "Restaurant violates the Food Safety Standards",
    "Restaurant attempts to manipulate buyer reviews",
    "Restaurant engages in abusive behavior towards buyers",
    "Restaurant is found to be engaged in money laundering",
    "Restaurant is found to be engaged in tax evasion",
  ];

  otherReason = "";

  constructor(
    private $adminClient: AdminClient,
    private $confirmation: ConfirmationService,
    private $restaurantClient: RestaurantClient,
    private $message: MessageService,
    private $zone: NgZone
  ) {
    this.refresh();
  }

  refresh() {
    this.$restaurantClient
      .search(
        undefined,
        undefined,
        undefined,
        true,
        new SearchRestaurantsRequest()
      )
      .pipe(
        switchMap((page) => {
          if (page.content) {
            this.restaurants = page.content;
          }

          return of(undefined);
        })
      )
      .subscribe();
  }

  toggleRestaurantStatus(restaurant: Restaurant, activate: boolean) {
    const intended = activate;

    this.$confirmation.confirm({
      message: `Do you want to ${intended ? "activate" : "deactivate"
        } this restaurant?`,
      header: "Toggle Status Confirmation",
      icon: "pi pi-info-circle",
      accept: () => {
        if (!intended) {
          this.deactivateDialogVisible = true;
          this.restaurant = restaurant;
        } else {
          restaurant.active = true;
          this.$restaurantClient
            .update(restaurant)
            .pipe(
              switchMap((errorMessage) => {
                if (errorMessage) throw new Error(errorMessage);

                this.$message.add({
                  severity: "success",
                  summary: "Success",
                  detail: "Restaurant activated successfully!",
                });

                return of(undefined);
              })
            )
            .subscribe();
        }
      },
      reject: () => {
        restaurant.active = !intended;
      },
    });
  }

  toggleDeleteRestaurantInactive(restaurantId: number) {
    this.$confirmation.confirm({
      message: "Do you want to delete this restaurant?",
      header: "Toggle Delete Confirmation",
      icon: "pi pi-info-circle",
      accept: () => {
        this.$adminClient
          .deleteRestaurantInactive(restaurantId)
          .subscribe(() => {
            this.$message.add({
              severity: "success",
              summary: "Success",
              detail: "Delete restaurant successfully!",
            });

            this.refresh();

            return of(undefined);
          });
      }
    });
  }

  deactivateRestaurant() {
    if (!this.restaurant) return;

    this.restaurant.active = false;
    this.restaurant.deactivateReasons = JSON.stringify(
      this.selectedDeactivateReasons
    );

    this.$restaurantClient
      .update(this.restaurant)
      .pipe(
        switchMap((errorMessage) => {
          if (errorMessage) throw new Error(errorMessage);

          this.$message.add({
            severity: "success",
            summary: "Success",
            detail: "Restaurant deactivated successfully!",
          });

          this.deactivateDialogVisible = false;
          this.refresh();
          return of(undefined);
        })
      )
      .subscribe();
  }

  getOwners(restaurant: Restaurant): string {
    if (!(restaurant as any).owners) return "";

    return (restaurant as any).owners.map((o) => o.email).join(", ");
  }

  onOtherReasonChange(otherReason: string) {
    this.selectedDeactivateReasons = this.selectedDeactivateReasons.filter(
      (r) => r !== this.otherReason
    );

    if (otherReason) {
      this.selectedDeactivateReasons.push(otherReason);
    }

    this.otherReason = otherReason;
  }

  getTotalRestaurantsByStatus(active: boolean): number {
    return this.restaurants.filter(r => r.active === active).length;
  }
}
