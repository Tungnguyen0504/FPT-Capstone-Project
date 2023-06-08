import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { NgForm, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { MessageService } from "primeng/api";
import { AuthService } from "src/app/global/auth.service";
import {
  AdminClient,
  Restaurant,
  RestaurantCategory,
  RestaurantCategoryClient,
  RestaurantClient,
  User,
  UserClient,
} from "src/app/ngswag/client";

@Component({
  selector: "app-add-restaurant-info",
  templateUrl: "./add-restaurant-info.component.html",
  styleUrls: ["./add-restaurant-info.component.scss"],
})
export class AddRestaurantInfoComponent implements OnInit {
  @ViewChild("form", { static: false }) form!: NgForm;

  restaurantId: number;
  restaurant = Restaurant.fromJS({});

  user?: User;
  uploadUrl: string;

  users: any[];
  selectedUsers: User[] = [];
  filteredUsers: User[] = [];

  restaurantCategories: any[];
  selectedCategories: RestaurantCategory[] = [];
  filteredCategories: RestaurantCategory[] = [];

  private _submitButtonDisabled = false;
  get submitButtonDisabled(): boolean {
    return !!this.form?.invalid || this._submitButtonDisabled;
  }

  set submitButtonDisabled(value: boolean) {
    this._submitButtonDisabled = value;
  }

  @Input() hasOwnersField = true;

  constructor(
    private $restaurantClient: RestaurantClient,
    private $restaurantCategoryClient: RestaurantCategoryClient,
    private $adminClient: AdminClient,
    private $userClient: UserClient,
    private $auth: AuthService,
    private $message: MessageService,
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
    }, 0);
  }

  ngOnInit() {
    this.$adminClient.getAllUserExceptAdmin().subscribe((users) => {
      this.users = users;
      this.filteredUsers = [...users];
    });

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
    this.restaurant.owners = this.selectedUsers;
    if (this.restaurant.address?.ward)
      this.restaurant.address.ward.id = this.form.value.ward.id;

    if (this.restaurant.address)
      this.restaurant.address.specificAddress = this.form.value.specificAddress;

    if (this.restaurant.phoneNumber?.startsWith("+84"))
      this.restaurant.phoneNumber.replace("+84", "0");

    this.$adminClient.insertRestaurant(this.restaurant).subscribe(() => {
      this.$message.add({
        severity: "success",
        summary: "Success",
        detail: "Add new restaurant successfully!",
      });
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

    this.filteredUsers = filtered;
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
