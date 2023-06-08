import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { OverlayPanel } from "primeng/overlaypanel";
import { switchMap, of, Observable } from "rxjs";
import { WebsocketService } from "src/app/global/websocket.service";
import {
  Notification,
  NotificationClient,
  User,
  UserClient,
} from "src/app/ngswag/client";
import { DateUtils } from "src/app/utils";

@Component({
  selector: "app-notifications",
  templateUrl: "./notifications.component.html",
  styleUrls: ["./notifications.component.scss"],
})
export class NotificationsComponent implements OnInit {
  notifications: Notification[] = [];
  currentUser?: User;
  @ViewChild("op") op!: OverlayPanel;

  constructor(
    private $notificationClient: NotificationClient,
    private $userClient: UserClient,
    private $webSocket: WebsocketService,
    private $router: Router,
    private $message: MessageService
  ) {}

  ngOnInit(): void {
    this.$webSocket.connect("/notification", (res) => {
      const notification = Notification.fromJS(JSON.parse(res.body));
      if (notification.toUsers?.some((u) => u.id === this.currentUser?.id)) {
        if (!notification.modifiedAt)
          (notification.modifiedAt as any) = new Date().getTime();

        this.refresh().subscribe();

        this.$message.add({
          severity: "info",
          summary: "Notification",
          detail: notification.message,
        });
      }
    });

    this.$userClient
      .getCurrentUser()
      .pipe(
        switchMap((user) => {
          if (!user?.id) return of(undefined);

          this.currentUser = user;
          return this.refresh();
        })
      )
      .subscribe();
  }

  refresh(): Observable<undefined> {
    if (!this.currentUser?.id) return of(undefined);

    return this.$notificationClient.getAllByUserId(this.currentUser?.id).pipe(
      switchMap((notifications) => {
        if (notifications) {
          this.notifications = notifications;
        }

        return of(undefined);
      })
    );
  }

  show(event: any) {
    this.op.toggle(event);
  }

  getModifiedDate(s: string | undefined): string | undefined {
    if (!s) return undefined;

    return DateUtils.fromDB(s).toString();
  }

  read(notification: Notification) {
    if (!notification.id) return;

    this.$notificationClient
      .deleteById(notification.id)
      .pipe(
        switchMap(() => {
          return this.refresh();
        }),
        switchMap(() => {
          this.op.hide();
          if (notification.url) this.$router.navigateByUrl(notification.url);
          return of(undefined);
        })
      )
      .subscribe();
  }

  clear() {
    if (!this.currentUser?.id) return;

    this.$notificationClient
      .deleteAllByUserId(this.currentUser?.id)
      .pipe(switchMap(() => this.refresh()))
      .subscribe();
  }
}
