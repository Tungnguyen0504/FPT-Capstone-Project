import { Component, OnInit } from "@angular/core";
import { AdminClient, Restaurant, User, UserRequestingRestaurantStatus } from "src/app/ngswag/client";

@Component({
  selector: "app-request-open-list",
  templateUrl: "./request-open-list.component.html",
})
export class RequestOpenListComponent implements OnInit {
  statuses: any[];
  loading = true;
  activityValues: number[] = [0, 100];
  requestingUsers: User[] = [];
  resList: Restaurant[] = [];

  constructor(private $adminClient: AdminClient) {
    this.$adminClient.getAllOpeningRestaurantRequests().subscribe((buyers) => {
      this.requestingUsers = buyers;
    });
  }

  ngOnInit(): void {}

  getTotalRequestsByStatus(status: UserRequestingRestaurantStatus) {
    return this.requestingUsers.filter(r => r.requestingRestaurantStatus === status).length;
  }
}
