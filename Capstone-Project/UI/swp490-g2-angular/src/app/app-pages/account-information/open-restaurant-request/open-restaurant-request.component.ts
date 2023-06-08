import {
  Component,
  OnInit,
  ViewChild,
  Input,
  AfterViewInit,
} from "@angular/core";
import { NgForm, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { AuthService } from "src/app/global/auth.service";
import {
  Address,
  BuyerClient,
  Restaurant,
  RestaurantCategory,
  RestaurantCategoryClient,
  User,
  Ward,
} from "src/app/ngswag/client";

@Component({
  selector: "app-open-restaurant-request",
  templateUrl: "./open-restaurant-request.component.html",
  styleUrls: ["./open-restaurant-request.component.scss"],
})
export class OpenRestaurantRequestComponent implements OnInit, AfterViewInit {
  @ViewChild("form", { static: false }) form!: NgForm;
  restaurantId: number;
  restaurant = Restaurant.fromJS({});

  user?: User;
  uploadUrl: string;

  users: any[];

  restaurantCategories: any[];
  selectedCategories: RestaurantCategory[] = [];
  filteredCategories: RestaurantCategory[] = [];
  showError = false;
  private _submitButtonDisabled = false;
  get submitButtonDisabled(): boolean {
    return !!this.form?.invalid || this._submitButtonDisabled;
  }

  set submitButtonDisabled(value: boolean) {
    this._submitButtonDisabled = value;
  }

  @Input() hasOwnersField = true;

  constructor(
    private $restaurantCategoryClient: RestaurantCategoryClient,
    private $auth: AuthService,
    private $message: MessageService,
    private $buyerClient: BuyerClient,
    private $router: Router,
    private $route: ActivatedRoute
  ) {
    this.refresh();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.form.controls["phoneNumber"].addValidators([
        Validators.required,
        Validators.pattern("^(([+]84)[3|5|7|8|9]|0[3|5|7|8|9])+([0-9]{8})$"),
      ]);
      this.form.controls["phoneNumber"].updateValueAndValidity();
    }, 1000);
  }

  ngOnInit() {
    this.$restaurantCategoryClient
      .getAll()
      .subscribe((restaurantCategories) => {
        this.restaurantCategories = restaurantCategories;
      });
  }
  refresh() {
    this.$auth.getCurrentUser().subscribe((user) => (this.user = user));
  }

  submit(): void {
    this.restaurant.restaurantCategories = this.selectedCategories;
    if (this.form.value?.ward && this.form.value?.specificAddress) {
      this.restaurant.address = Address.fromJS({});
      this.restaurant.address.ward = Ward.fromJS({});
      this.restaurant.address.ward.id = this.form.value.ward.id;
      this.restaurant.address.specificAddress = this.form.value.specificAddress;
    }

    if (this.restaurant.phoneNumber?.startsWith("+84"))
      this.restaurant.phoneNumber.replace("+84", "0");

    this.$buyerClient
      .requestOpeningNewRestaurant(this.restaurant)
      .subscribe(() => {
        this.$message.add({
          severity: "success",
          summary: "Success",
          detail:
            "Opening a new restaurant request has been sent to admin successfully!",
        });

        this.$router.navigate([".."], { relativeTo: this.$route });
      });
  }

  filterUser(event) {
    const filtered: any[] = [];
    const query = event.query;

    for (let i = 0; i < this.users.length; i++) {
      const user = this.users[i];
      if (user.email.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(user);
      }
    }
  }

  filterRestaurantCategory(event) {
    const filtered: any[] = [];
    const query = event.query;

    for (let i = 0; i < this.restaurantCategories.length; i++) {
      const restaurantCategory = this.restaurantCategories[i];
      if (
        restaurantCategory.restaurantCategoryName
          .toLowerCase()
          .indexOf(query.toLowerCase()) == 0
      ) {
        filtered.push(restaurantCategory);
      }
    }

    this.filteredCategories = filtered;
  }
}
