import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { MenuItem } from "primeng/api";
import { AdminClient, User, UserClient } from "src/app/ngswag/client";
import { DateUtils } from "src/app/utils";

@Component({
  selector: "app-view-user-details",
  templateUrl: "./view-user-details.component.html",
})
export class ViewUserDetailsComponent implements OnInit {
  userId: number;
  user?: User;
  constructor(
    private $adminClient: AdminClient,
    private $route: ActivatedRoute,
    private $userClient: UserClient
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
      this.user.dateOfBirth = DateUtils.fromDB(this.user.dateOfBirth);
      this.user.createdAt = DateUtils.fromDB(this.user.createdAt);
    });
  }

  ngOnInit(): void {}
  items: MenuItem[];

  get bannedReasons(): string[] {
    if (!this.user || this.user.userStatus !== "BANNED") {
      return [];
    }

    try {
      return JSON.parse(this.user.bannedReasons!);
    } catch (error) {
      return [];
    }
  }
}
