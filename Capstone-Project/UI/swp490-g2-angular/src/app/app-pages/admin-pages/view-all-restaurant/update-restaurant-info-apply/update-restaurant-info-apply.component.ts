import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { NgForm, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { MessageService } from "primeng/api";
import { forkJoin, map, of, switchMap } from "rxjs";
import { AuthService } from "src/app/global/auth.service";
import { RestaurantCategoryClient, UserClient } from "src/app/ngswag/client";
import {
  AdminClient,
  File,
  Restaurant,
  RestaurantClient,
  User,
  Ward,
} from "src/app/ngswag/client";

@Component({
  selector: "app-update-restaurant-info-apply",
  templateUrl: "./update-restaurant-info-apply.component.html",
})
export class UpdateRestaurantInfoApplyComponent
  implements OnInit, AfterViewInit
{
  @ViewChild("form", { static: false }) form!: NgForm;

  restaurantId: number;
  restaurant?: Restaurant;
  user?: User;
  uploadUrl: string;

  restaurantCategories: any[];
  selectedCategory: any[];
  filteredCategories: any[];

  constructor(
    private $restaurantClient: RestaurantClient,
    private $restaurantCategoryClient: RestaurantCategoryClient,
    private $adminClient: AdminClient,
    private $userClient: UserClient,
    private $auth: AuthService,
    private $message: MessageService,
    private $route: ActivatedRoute
  ) {
    const id: number = Number.parseInt(
      <string>this.$route.snapshot.paramMap.get("id")
    );

    this.restaurantId = id;
    this.uploadUrl = "restaurant/update-avatar/" + id;
    this.refresh();
  }

  refresh() {
    this.$auth
      .getCurrentUser()
      .pipe(
        switchMap((user) => {
          this.user = user;
          return forkJoin([
            this.$adminClient.getRestaurantById(this.restaurantId),
            this.$userClient.hasControlsOfRestaurant(this.restaurantId),
          ]);
        }),
        switchMap(([restaurant, hasControlsOfRestaurant]) => {
          this.restaurant = restaurant;
          if (this.user && hasControlsOfRestaurant)
            this.user.restaurants = [restaurant];

          if (restaurant.id) {
            return this.$userClient.getAllOwnersByRestaurantIds([
              restaurant.id,
            ]);
          } else return of(undefined);
        })
      )
      .subscribe((owners) => {
        if (owners) {
          (this.restaurant as any).owners = owners;
        }
      });
  }

  submit(): void {
    if (!this.restaurant) return;

    if (this.restaurant.address) {
      this.restaurant.address.ward = new Ward({
        id: this.form.value.ward.id,
      });

      this.restaurant.address.specificAddress = this.form.value.specificAddress;
    }

    if (this.selectedCategory) {
      this.restaurant.restaurantCategories = this.selectedCategory;
    }

    this.$restaurantClient
      .update(this.restaurant)
      .pipe(
        map((errorMessage) => {
          if (errorMessage) throw new Error(errorMessage);

          this.$message.add({
            severity: "success",
            summary: "Success",
            detail: "Restaurant's information has changed",
          });
        })
      )
      .subscribe();
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

    if (this.restaurant) {
      return;
    }
    this.$restaurantCategoryClient
      .getAllRestaurantCategoryByRestaurantId(this.restaurantId)
      .subscribe((result) => {
        this.selectedCategory = result;
      });
  }

  updateAvatar(image: File) {
    if (!this.restaurant) return;

    this.restaurant.avatarFile = image;
    this.$restaurantClient
      .update(this.restaurant)
      .subscribe(() => location.reload());
  }

  get editable(): boolean {
    if (!this.user || !this.user.id) return false;
    if (AuthService.isAdmin(this.user)) return true;
    if (
      AuthService.isSeller(this.user) &&
      this.user.restaurants?.some(
        (restaurant) => restaurant.id === this.restaurant?.id
      )
    ) {
      return true;
    }

    return false;
  }

  getOwners(restaurant: Restaurant): string {
    if (!(restaurant as any).owners) return "";

    return (restaurant as any).owners.map((o) => o.email).join(", ");
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
