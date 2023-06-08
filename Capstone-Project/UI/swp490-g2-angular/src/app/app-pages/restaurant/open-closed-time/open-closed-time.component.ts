import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { MessageService } from "primeng/api";
import { map } from "rxjs";
import { Restaurant, RestaurantClient } from "src/app/ngswag/client";
import { DateUtils } from "src/app/utils";

@Component({
  selector: "app-open-closed-time",
  templateUrl: "./open-closed-time.component.html",
  styleUrls: ["./open-closed-time.component.scss"],
})
export class OpenClosedTimeComponent implements OnInit {
  @Input() restaurant: Restaurant;
  @Input() editable: boolean;
  isEditing = false;
  openTimeModel?: Date;
  closedTimeModel?: Date;
  @Output() saveChanges = new EventEmitter();

  constructor(
    private $restaurantClient: RestaurantClient,
    private $message: MessageService
  ) {}

  ngOnInit(): void {}

  onButtonClick() {
    if (!this.isEditing) {
      this.isEditing = true;
      if (this.restaurant.openTime && this.restaurant.closedTime) {
        this.openTimeModel = DateUtils.fromLocalTimeStringToDate(
          this.restaurant.openTime
        );
        this.closedTimeModel = DateUtils.fromLocalTimeStringToDate(
          this.restaurant.closedTime
        );
      }
    } else {
      if (this.openTimeModel && this.closedTimeModel) {
        this.isEditing = false;
        this.restaurant.openTime = DateUtils.fromDateToLocalTimeString(
          this.openTimeModel
        );
        this.restaurant.closedTime = DateUtils.fromDateToLocalTimeString(
          this.closedTimeModel
        );

        const intlDateObj = new Intl.DateTimeFormat("en-US", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
          hour12: false,
          timeZone: "Asia/Ho_Chi_Minh",
        });

        const nowDate = new Date(intlDateObj.format(new Date()));
        const now = new Date(
          2023,
          0,
          1,
          nowDate.getHours(),
          nowDate.getMinutes()
        );
        if (this.openTimeModel.getTime() <= this.closedTimeModel.getTime()) {
          this.restaurant.opening =
            this.openTimeModel.getTime() <= now.getTime() &&
            now.getTime() <= this.closedTimeModel.getTime();
        } else {
          this.restaurant.opening = !(
            this.closedTimeModel.getTime() <= now.getTime() &&
            now.getTime() <= this.openTimeModel.getTime()
          );
        }
      }

      this.$restaurantClient
        .update(this.restaurant)
        .pipe(
          map((errorMessage) => {
            if (errorMessage) throw new Error(errorMessage);

            this.$message.add({
              severity: "success",
              summary: "Success",
              detail: "Open/closed time has been changed!",
            });

            this.saveChanges.emit();
          })
        )
        .subscribe();
    }
  }

  getLocalTimeDisplay(s: string | undefined) {
    if (!s) return "N/A";

    try {
      const splitted = s.split(":");
      return `${splitted[0]}:${splitted[1]}`;
    } catch (error) {
      return "N/A";
    }
  }
}
