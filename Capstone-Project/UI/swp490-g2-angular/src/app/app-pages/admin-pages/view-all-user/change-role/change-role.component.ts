import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ConfirmationService, MessageService } from "primeng/api";
import { finalize, of, switchMap } from "rxjs";
import {
  AdminClient,
  Restaurant,
  User,
  UserClient,
} from "src/app/ngswag/client";

@Component({
  selector: "app-change-role",
  templateUrl: "./change-role.component.html",
})
export class ChangeRoleComponent implements OnInit {
  user?: User;
  userId: number;
  displayRestaurantList = false;
  displayRestaurantListToDelete = false;

  constructor(
    private $adminClient: AdminClient,
    private $route: ActivatedRoute,
    private $userClient: UserClient,
    private $confirmation: ConfirmationService,
    private $message: MessageService
  ) {
    const id: number = Number.parseInt(
      <string>this.$route.snapshot.paramMap.get("id")
    );

    this.userId = id;
    this.refresh();
  }
  refresh() {
    this.$userClient.getById(this.userId).subscribe((users) => {
      this.user = users;
    });
  }
  ngOnInit(): void {}

  get isBuyer(): boolean {
    return !!this.user?.roles?.includes("BUYER");
  }

  get isSeller(): boolean {
    return !!this.user?.roles?.includes("SELLER");
  }

  get isAdmin(): boolean {
    return !!this.user?.roles?.includes("ADMIN");
  }

  openConfirmSeller(forceOpen = false) {
    if (forceOpen || !this.isSeller) {
      this.$confirmation.confirm({
        header: "Confirmation",
        message: "Are you sure to select a new restaurant for the seller?",
        accept: () => {
          this.displayRestaurantList = true;
        },
      });
    } else {
      this.$confirmation.confirm({
        header: "Confirmation",
        message:
          "Are you sure to remove all restaurants' ownership for the seller?",
        accept: () => {
          if (!this.user?.id) return;

          this.$adminClient
            .removeRestaurantsByRestaurantIdsForSeller(this.user.id, true, [])
            .pipe(
              switchMap((errorMessage) => {
                if (errorMessage) throw new Error(errorMessage);

                this.$message.add({
                  severity: "success",
                  summary: "Success",
                  detail: `Remove role SELLER from user [${this.user?.firstName}]`,
                });

                return of(undefined);
              }),
              finalize(() => {
                this.refresh();
              })
            )
            .subscribe();
        },
      });
    }
  }

  openConfirmSellerDeleteRestaurant() {
    this.$confirmation.confirm({
      header: "Confirmation",
      message:
        "Are you sure to select a new restaurant to delete for the seller?",
      accept: () => {
        this.displayRestaurantListToDelete = true;
      },
    });
  }

  openConfirmAdmin() {
    if (!this.isAdmin) {
      this.$confirmation.confirm({
        header: "Confirmation",
        message:
          "Are you sure to promote this user to admin, this action cannot be undone?",
        accept: () => {
          if (!this.user?.id) return;
          this.$adminClient
            .promoteUserToAdmin(this.user.id)
            .subscribe((errorMessage) => {
              if (errorMessage) throw new Error(errorMessage);

              this.$message.add({
                severity: "success",
                summary: "Success",
                detail: `Promote user [${this.user?.firstName}] to admin successfully!`,
              });

              this.refresh();
            });
        },
      });
    }
  }

  openConfirmBuyer() {
    if (!this.isBuyer) {
      this.$confirmation.confirm({
        header: "Confirmation",
        message:
          "Are you sure to activate this user to become buyer, this action cannot be undone?",
        accept: () => {
          if (!this.user?.id) return;
          this.$adminClient
            .promoteUserToBuyer(this.user.id)
            .subscribe((errorMessage) => {
              if (errorMessage) throw new Error(errorMessage);

              this.$message.add({
                severity: "success",
                summary: "Success",
                detail: `Promote user [${this.user?.firstName}] to buyer successfully!`,
              });

              this.refresh();
            });
        },
      });
    }
  }

  selectRestaurant(restaurant: Restaurant) {
    if (!this.user?.id || !restaurant.id) return;

    this.$adminClient
      .addRestaurantForSeller(this.user.id, restaurant.id)
      .subscribe((errorMessage) => {
        if (errorMessage) throw new Error(errorMessage);

        this.$message.add({
          severity: "success",
          summary: "Success",
          detail: `Added restaurant [${restaurant.restaurantName}] to seller [${this.user?.firstName}] successfully!`,
        });

        this.displayRestaurantList = false;
        location.reload();
      });
  }

  deleteRestaurant(restaurant: Restaurant) {
    if (!this.user?.id || !restaurant.id) return;

    this.$adminClient
      .removeRestaurantsByRestaurantIdsForSeller(this.user.id, false, [
        restaurant.id,
      ])
      .subscribe((errorMessage) => {
        if (errorMessage) throw new Error(errorMessage);

        this.$message.add({
          severity: "success",
          summary: "Success",
          detail: `Removed restaurant [${restaurant.restaurantName}] from seller [${this.user?.firstName}] successfully!`,
        });

        this.displayRestaurantListToDelete = false;
        location.reload();
      });
  }
}
