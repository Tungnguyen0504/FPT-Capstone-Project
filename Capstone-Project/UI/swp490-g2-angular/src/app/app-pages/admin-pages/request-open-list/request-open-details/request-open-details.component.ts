import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MenuItem } from "primeng/api";
import { finalize } from "rxjs";
import {
  AdminClient,
  Restaurant,
  RestaurantClient,
  User,
  UserClient,
} from "src/app/ngswag/client";
import { DateUtils, getFullAddress } from "src/app/utils";

@Component({
  selector: "app-request-open-details",
  templateUrl: "./request-open-details.component.html",
})
export class RequestOpenDetailsComponent implements OnInit {
  selectedReasons: string[] = [];
  checked = false;
  statuses: any[];
  loading = true;
  activityValues: number[] = [0, 100];
  requestingUsers: User[] = [];
  acceptRes: User[] = [];
  displayModal: boolean;
  displayMaximizable: boolean;
  requester?: User;
  userId: number;
  restaurant: Restaurant;
  reasons = [
    "This request sent not enough information",
    "This restaurant is too far from Thach That District, Ha Noi",
    "This restaurant had banned in the past",
  ];

  otherReason = "";

  constructor(
    private $adminClient: AdminClient,
    private $route: ActivatedRoute,
    private $userClient: UserClient,
    private $restaurantClient: RestaurantClient,
    private $router: Router
  ) {
    const id: number = Number.parseInt(
      <string>this.$route.snapshot.paramMap.get("id")
    );

    this.userId = id;
    this.refresh();
  }

  refresh() {
    this.$userClient.getById(this.userId).subscribe((requester) => {
      this.requester = requester;
      this.requester.requestingOpeningRestaurantDate = DateUtils.fromDB(
        this.requester.requestingOpeningRestaurantDate
      );
    });
  }

  ngOnInit(): void {}
  items: MenuItem[];

  showModalDialog() {
    this.displayModal = true;
  }

  showMaximizableDialog() {
    this.displayMaximizable = true;
  }

  getStatus() {
    return (
      !this.requester?.requestingRestaurantStatus ||
      this.requester?.requestingRestaurantStatus === "PENDING"
    );
  }

  approve() {
    this.$adminClient
      .approveBecomeSeller(this.userId)
      .pipe(
        finalize(() => {
          this.displayModal = false;
        })
      )
      .subscribe(() => {
        this.$router.navigate([".."], { relativeTo: this.$route });
      });
  }

  rejected() {
    if (!this.selectedReasons.length) {
      throw new Error("You must select at least 1 reason!");
    }

    this.$adminClient
      .rejectBecomeSeller(this.userId, JSON.stringify(this.selectedReasons))
      .pipe(
        finalize(() => {
          this.displayModal = false;
        })
      )
      .subscribe(() => {
        this.$router.navigate([".."], { relativeTo: this.$route });
      });
  }

  get rejectRestaurantOpeningReasons(): string[] {
    if (!this.requester?.rejectRestaurantOpeningRequestReasons) return [];

    return JSON.parse(
      JSON.parse(this.requester?.rejectRestaurantOpeningRequestReasons)
    );
  }

  onOtherReasonChange(otherReason: string) {
    this.selectedReasons = this.selectedReasons.filter(
      (r) => r !== this.otherReason
    );

    if (otherReason) {
      this.selectedReasons.push(otherReason);
    }

    this.otherReason = otherReason;
  }

  get fullAddress(): string {
    return getFullAddress(this.requester?.requestingRestaurant?.address);
  }
}
