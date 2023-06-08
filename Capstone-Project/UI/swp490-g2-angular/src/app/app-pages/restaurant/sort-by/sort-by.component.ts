import { Component, EventEmitter, Output } from "@angular/core";
import { MenuItem } from "primeng/api";
import { SortRequest } from "src/app/ngswag/client";

@Component({
  selector: "app-sort-by",
  templateUrl: "./sort-by.component.html",
  styleUrls: ["./sort-by.component.scss"],
})
export class SortByComponent {
  items: MenuItem[] = [
    { label: "Name", command: this.onSelectedItem.bind(this) },
    { label: "Price", command: this.onSelectedItem.bind(this) },
  ];

  sortDirection: "ASC" | "DESC" = "ASC";
  selectedItem = this.items[0];
  @Output() sortedBy = new EventEmitter<SortRequest>();

  onSelectedItem(event: any) {
    this.selectedItem = event.item;
    this.emitSortBy();
  }

  changeSortDirection() {
    if (this.sortDirection === "ASC") {
      this.sortDirection = "DESC";
    } else {
      this.sortDirection = "ASC";
    }

    this.emitSortBy();
  }

  get sortDirectionIcon(): string {
    return (
      "pi " + (this.sortDirection === "ASC" ? "pi-arrow-up" : "pi-arrow-down")
    );
  }

  get selectedItemKey(): string {
    switch (this.selectedItem.label) {
      case "Name":
        return "productName";

      case "Price":
        return "price";

      default:
        return "";
    }
  }

  emitSortBy(): void {
    this.sortedBy.emit(
      new SortRequest({
        key: this.selectedItemKey,
        direction: this.sortDirection,
      })
    );
  }
}
