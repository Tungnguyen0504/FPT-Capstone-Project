import { Component, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { MenuItem, MessageService } from "primeng/api";
import { finalize, forkJoin, Observable, of, switchMap } from "rxjs";
import { AuthService } from "src/app/global/auth.service";
import {
  AdminClient,
  File,
  FilterRequest,
  OrderClient,
  PageProduct,
  Product,
  ProductCategory,
  ProductCategoryClient,
  ProductClient,
  Restaurant,
  RestaurantClient,
  RestaurantReview,
  RestaurantReviewResponse,
  SearchRequest,
  SortRequest,
  User,
  UserClient,
} from "src/app/ngswag/client";
import { DateUtils, getFullAddress, getFullName } from "src/app/utils";

@Component({
  selector: "app-restaurant",
  templateUrl: "./restaurant.component.html",
  styleUrls: ["./restaurant.component.scss"],
})
export class RestaurantComponent implements OnInit {
  @ViewChild("restaurantReviewForm", { static: false })
  restaurantReviewForm!: NgForm;

  items: MenuItem[];
  restaurant?: Restaurant;
  restaurantId: number;
  uploadUrl: string;
  user?: User;
  categories: ProductCategory[] = [];
  selectedCategoryIds: number[] = [];
  originalSelectedCategoryIds: number[] = [];
  products: Product[] = [];
  priceRange: number[] = [0, 0];
  selectedPriceRange: number[] = [0, 0];
  currentPage = 0;
  private pageSize = 12;
  totalPages = 0;
  private timeout?: number;
  private isFulltextSearching = false;
  fulltext = "";
  isOpening = true;
  sorts: SortRequest[] = [
    new SortRequest({
      key: "productName",
      direction: "ASC",
    }),
  ];
  isVisible = false;
  restaurantReviewVisible = false;
  restaurantReview: RestaurantReview = new RestaurantReview();
  restaurantReviewResponse = new RestaurantReviewResponse({
    averageStars: 0,
    starRatios: [0, 0, 0, 0, 0],
  });

  reviewPagable = new SearchRequest({
    page: 0,
    size: 5,
  });

  totalReviewRecords = 0;
  canReview = false;

  constructor(
    private $route: ActivatedRoute,
    private $restaurantClient: RestaurantClient,
    private $auth: AuthService,
    private $productCategoryClient: ProductCategoryClient,
    private $productClient: ProductClient,
    private $userClient: UserClient,
    private $adminClient: AdminClient,
    private $orderClient: OrderClient,
    private $title: Title,
    private router: Router,
    private $message: MessageService
  ) {
    const id: number = Number.parseInt(
      <string>this.$route.snapshot.paramMap.get("id")
    );

    this.uploadUrl = "restaurant/update-avatar/" + id;
    this.restaurantId = id;
    this.refresh();
  }

  ngOnInit() {
    this.items = [
      { label: "Add New", icon: "pi pi-fw pi-plus" },
      { label: "Remove", icon: "pi pi-fw pi-minus" },
    ];
  }

  refresh() {
    this.$auth
      .getCurrentUser()
      .pipe(
        switchMap((user) => {
          this.user = user;
          if (AuthService.isSeller(this.user) || AuthService.isAdmin(this.user))
            this.isVisible = true;
          return forkJoin([
            this.$restaurantClient.getById(this.restaurantId),
            this.$userClient.hasControlsOfRestaurant(this.restaurantId),
          ]);
        }),
        switchMap(([restaurant, hasControlsOfRestaurant]) => {
          if (this.user && hasControlsOfRestaurant)
            this.user.restaurants = [restaurant];

          this.restaurant = restaurant;
          this.restaurantReview.restaurant = restaurant;
          if (this.restaurant.restaurantName)
            this.$title.setTitle(this.restaurant.restaurantName);

          return forkJoin([
            this.$productCategoryClient.getAllByRestaurantId(this.restaurantId),
            this.$productClient.getProductPriceRangesByRestaurantId(
              this.restaurantId
            ),
          ]);
        }),
        switchMap(([categories, priceRange]) => {
          this.categories = categories;
          // this.selectedCategoryIds = this.categories.map((c) => c.id!);
          this.originalSelectedCategoryIds = [
            ...this.categories.map((c) => c.id!),
          ];

          this.priceRange = priceRange;
          this.selectedPriceRange = [...this.priceRange];

          return this.productSearch();
        }),
        switchMap((productPage) => {
          this.products = productPage.content!;
          this.totalPages = productPage.totalPages!;
          return of();
        })
      )
      .subscribe();

    this.refreshReviews();

    if (this.user) {
      this.$orderClient
        .checkUserEverOrderedInRestaurant(this.user.id!, this.restaurantId)
        .subscribe((result) => {
          this.canReview = result;
        });
    }
  }

  private refreshReviews() {
    this.$restaurantClient
      .getReviewsByRestaurantId(this.restaurantId, this.reviewPagable)
      .pipe(
        switchMap((response) => {
          if (response.restaurantReviewPage?.totalElements === undefined)
            return of(undefined);

          this.restaurantReviewResponse = response;
          this.totalReviewRecords = response.restaurantReviewPage.totalElements;
          return of(undefined);
        })
      )
      .subscribe();
  }

  private productSearch(): Observable<PageProduct> {
    const filters: FilterRequest[] = [];

    if (this.selectedCategoryIds.length > 0) {
      filters.push(
        new FilterRequest({
          key: "categories.id",
          operator: "IN",
          fieldType: "LONG",
          values: this.selectedCategoryIds,
        })
      );
    }

    if (
      this.selectedPriceRange?.length > 1 &&
      this.selectedPriceRange[0] &&
      this.selectedPriceRange[1]
    ) {
      filters.push(
        new FilterRequest({
          key: "price",
          operator: "BETWEEN",
          fieldType: "DOUBLE",
          value: this.selectedPriceRange[0],
          valueTo: this.selectedPriceRange[1],
        })
      );
    }

    return this.$productClient.search(
      this.restaurantId,
      new SearchRequest({
        filters: filters,
        sorts: this.sorts,
        page: this.currentPage,
        size: this.pageSize,
      })
    );
  }

  updateAvatar(image: File) {
    if (!this.restaurant) return;

    this.restaurant.avatarFile = image;
    this.updateRestaurant();
  }

  private updateRestaurant() {
    if (!this.restaurant) return;
    if (
      !this.restaurant.bankDetail?.accountName ||
      !this.restaurant.bankDetail?.accountNumber ||
      !this.restaurant.bankDetail?.acqId
    ) {
      this.restaurant.bankDetail = undefined;
    }

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

  toggleAllCategories(selected: boolean) {
    if (selected) {
      this.selectedCategoryIds = [...this.originalSelectedCategoryIds];
    } else {
      this.selectedCategoryIds = [];
    }

    this.productSearch().subscribe((productPage) => {
      this.products = productPage.content!;
      this.totalPages = productPage.totalPages!;
    });
  }

  changeFilter() {
    this.fulltext = "";
    this.isFulltextSearching = false;
    this.currentPage = 0;
    this.productSearch().subscribe((productPage) => {
      this.products = productPage.content!;
      this.totalPages = productPage.totalPages!;
    });
  }

  loadMore() {
    this.currentPage++;
    this.productSearch().subscribe((productPage) => {
      this.products = this.products.concat(productPage.content!);
      this.totalPages = productPage.totalPages!;
    });
  }

  fulltextSearch() {
    window.clearTimeout(this.timeout);

    this.timeout = window.setTimeout(() => {
      const text = this.fulltext;
      if (text.trim().length === 0) {
        this.changeFilter();
        return;
      }

      this.isFulltextSearching = true;
      // this.selectedCategoryIds = [...this.originalSelectedCategoryIds];
      this.selectedPriceRange = [...this.priceRange];
      this.$productClient
        .fulltextSearch(text, this.restaurantId)
        .subscribe((products) => {
          this.products = products;
        });
    }, 300);
  }

  get loadMoreShown(): boolean {
    if (this.isFulltextSearching) return false;
    return this.currentPage < this.totalPages - 1;
  }

  onSortByChange(sortRequest: SortRequest) {
    this.sorts = [sortRequest];
    this.changeFilter();
  }

  get fullAddress(): string {
    return getFullAddress(this.restaurant?.address);
  }
  navigateAddItem() {
    this.router.navigate(["restaurant", this.restaurantId, "add-product"]);
  }

  private _restaurantReviewSubmitButtonDisabled = false;
  get restaurantReviewSubmitButtonDisabled(): boolean {
    return (
      !!this.restaurantReviewForm?.invalid ||
      this._restaurantReviewSubmitButtonDisabled
    );
  }

  set restaurantReviewSubmitButtonDisabled(value: boolean) {
    this._restaurantReviewSubmitButtonDisabled = value;
  }

  submitReview() {
    this._restaurantReviewSubmitButtonDisabled = true;
    this.$restaurantClient
      .review(this.restaurantReview)
      .pipe(
        switchMap((errorMessage) => {
          if (errorMessage) throw new Error(errorMessage);

          this.$message.add({
            severity: "success",
            summary: "Success",
            detail: "Your review has been submitted!",
          });

          return of(undefined);
        }),
        finalize(() => {
          this._restaurantReviewSubmitButtonDisabled = false;
          this.restaurantReviewVisible = false;
          this.refresh();
        })
      )
      .subscribe();
  }

  openRestaurantReviewDialog() {
    this.restaurantReviewVisible = true;
  }

  getFullName(user?: User) {
    return getFullName(user);
  }

  getDate(date: any) {
    return new Date(DateUtils.fromDB(date));
  }

  get totalCountReviews(): number {
    return (
      this.restaurantReviewResponse.starCounts?.reduce(
        (acc, subtotal) => acc + subtotal
      ) || 0
    );
  }

  getReviewRatio(stars: number): number {
    if (!this.restaurantReviewResponse.starCounts || !this.totalCountReviews)
      return 0;

    const num =
      (this.restaurantReviewResponse.starCounts[stars - 1] * 100) /
      this.totalCountReviews;

    const num5 =
      100 -
      Math.round(
        (this.restaurantReviewResponse.starCounts[0] * 100) /
          this.totalCountReviews
      ) -
      Math.round(
        (this.restaurantReviewResponse.starCounts[1] * 100) /
          this.totalCountReviews
      ) -
      Math.round(
        (this.restaurantReviewResponse.starCounts[2] * 100) /
          this.totalCountReviews
      ) -
      Math.round(
        (this.restaurantReviewResponse.starCounts[3] * 100) /
          this.totalCountReviews
      );

    switch (stars) {
      case 1:
      case 2:
      case 3:
      case 4:
        return Math.round(num);

      case 5:
        return Math.round(num5);
    }

    return 0;
  }

  onReviewPageChange(event: any) {
    this.reviewPagable.page = event.page;
    this.reviewPagable.size = event.rows;
    this.refreshReviews();
  }

  onStarClick(star?: number) {
    if (star) {
      this.reviewPagable.filters = [
        new FilterRequest({
          key: "stars",
          operator: "EQUAL",
          fieldType: "INTEGER",
          value: star,
        }),
      ];
    } else {
      this.reviewPagable.filters = [];
    }

    this.refreshReviews();
  }

  get canReply(): boolean {
    return !!this.user?.restaurants?.length;
  }

  openReplyPanel(review: RestaurantReview) {
    review.replySeller = this.user;
    review["isReplying"] = true;
  }

  sendReply(review: RestaurantReview) {
    this.$restaurantClient
      .replyReview(review)
      .pipe(
        switchMap((errorMessage) => {
          if (errorMessage) throw new Error(errorMessage);
          return of(undefined);
        }),
        finalize(() => {
          review["isReplying"] = false;
          this.refresh();
        })
      )
      .subscribe();
  }

  deleteComment(review: RestaurantReview) {
    this.$restaurantClient
      .deleteReviewReply(review)
      .pipe(
        finalize(() => {
          review["isReplying"] = false;
          this.refresh();
        })
      )
      .subscribe();
  }
}
