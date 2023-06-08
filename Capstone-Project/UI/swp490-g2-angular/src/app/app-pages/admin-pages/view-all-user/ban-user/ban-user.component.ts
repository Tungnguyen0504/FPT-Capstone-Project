import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ConfirmationService, MessageService } from "primeng/api";
import { of, switchMap } from "rxjs";
import { User, AdminClient, UserClient } from "src/app/ngswag/client";

@Component({
  selector: "app-ban-user",
  templateUrl: "./ban-user.component.html",
  styleUrls: ["./ban-user.component.scss"],
})
export class BanUserComponent implements OnInit {
  selectedReasons: string[] = [];
  checked = false;
  userId: number;
  user?: User;

  buyerReasons: string[] = [
    "This account violates the website's information security policy",
    "This account frequently uses inappropriate language",
    "This account has repeatedly failed to pay for orders or has a history of non-payment",
  ];

  sellerReasons: string[] = [
    "Seller is failed to obtain the necessary permits or licenses",
    "Seller violates the Food Safety Standards",
    "Seller attempts to manipulate buyer reviews",
    "Seller engages in abusive behavior towards buyers",
    "Seller is found to be engaged in money laundering",
    "Seller is found to be engaged in tax evasion",
  ];

  otherReason = "";

  constructor(
    private $adminClient: AdminClient,
    private $route: ActivatedRoute,
    private $router: Router,
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

  onBanButtonClick() {
    if (!this.user) return;

    this.user.bannedReasons = JSON.stringify(this.selectedReasons);
    this.$confirmation.confirm({
      header: "Confirmation",
      message: "Are you sure that you want to ban this user?",
      accept: () => {
        this.$adminClient
          .banUser(this.user!)
          .pipe(
            switchMap((errorMessage) => {
              if (errorMessage) throw new Error(errorMessage);

              this.$router.navigate(["admin-pages", "view-all-user"]);

              return of(undefined);
            })
          )
          .subscribe();
      },
    });
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
}
