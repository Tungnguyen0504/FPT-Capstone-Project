import { Component, NgZone, OnInit, ViewEncapsulation } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { Router, ActivatedRoute } from "@angular/router";
import { MenuItem, MessageService } from "primeng/api";
import { AuthService } from "src/app/global/auth.service";
import {
  Order,
  OrderProductDetail,
  Product,
  ProductCategory,
  ProductClient,
  RestaurantCategory,
  RestaurantCategoryClient,
  User,
} from "src/app/ngswag/client";
import { CartService } from "src/app/service/cart.service";

@Component({
  selector: "app-home-page",
  templateUrl: "./home-page.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class HomePageComponent implements OnInit {
  user?: User;
  order: Order | undefined;
  productId: number | undefined;
  products: Product[];

  restaurantCategories: RestaurantCategory[] = [];
  allCategories: ProductCategory[] = [];
  responsiveOptions = [
    {
      breakpoint: "1400px",
      numVisible: 3,
      numScroll: 3,
    },
    {
      breakpoint: "1220px",
      numVisible: 2,
      numScroll: 2,
    },
    {
      breakpoint: "1100px",
      numVisible: 1,
      numScroll: 1,
    },
  ];

  constructor(
    private $router: Router,
    private $route: ActivatedRoute,
    $title: Title,
    $auth: AuthService,
    private $cart: CartService,
    private $productClient: ProductClient,
    private $message: MessageService,
    private $zone: NgZone,
    private $restaurantCategoryClient: RestaurantCategoryClient
  ) {
    $title.setTitle("Home");
    $auth.getCurrentUser().subscribe((user) => (this.user = user));
  }
  items!: MenuItem[];

  ngOnInit(): void {
    this.$productClient.getTopMostOrdered(10).subscribe((products) => {
      this.products = products.filter((p) => p.restaurant?.id);
    });

    this.$cart.getOrderObservable().subscribe((order) => (this.order = order));

    this.$restaurantCategoryClient.getAll().subscribe((categories) => {
      this.restaurantCategories = categories;
    });
  }

  get initialized(): boolean {
    return true;
  }

  getProductStatus(product: Product):
    | {
        name: string;
        textColor: string;
      }
    | undefined {
    switch (product.productStatus) {
      case "ACTIVE":
        return {
          name: "Available",
          textColor: "text-green-500",
        };

      case "OUT_OF_STOCK":
        return {
          name: "Out of stock",
          textColor: "text-red-500",
        };
    }

    return undefined;
  }

  navToLogin() {
    this.$router.navigate(["auth", "login"], { relativeTo: this.$route });
  }

  navToRegister() {
    this.$router.navigate(["auth", "register"], { relativeTo: this.$route });
  }

  navToForgotPassword() {
    this.$router.navigate(["auth", "forgot-password"], {
      relativeTo: this.$route,
    });
  }

  navToFeed() {
    this.$router.navigate(["feed-page"], { relativeTo: this.$route });
  }

  userExisted(): boolean {
    // !! giup ep kieu sang boolean
    return !!(this.user && this.user.email);
  }

  onProductImageClick(product: Product) {
    this.$router.navigate(["restaurant", product.restaurant?.id]);
  }

  addToCart(product: Product): void {
    if (!product.restaurant) return;

    if (
      this.order?.orderProductDetails?.length &&
      product.restaurant?.id !== this.$cart.restaurant$.value?.id
    ) {
      throw new Error("You need to empty the cart before do this action!");
    }

    const orderProductDetail: OrderProductDetail = new OrderProductDetail({
      product: product,
      quantity: 1,
      price: product.price,
    });

    this.$cart.addToCart(orderProductDetail, product.restaurant);

    this.$zone.run(() => {
      this.$message.add({
        severity: "success",
        summary: "Success",
        detail: `Product [${product.productName}] is added to cart!`,
      });
    });
  }

  getRestaurantCategoryImage(category: RestaurantCategory) {
    return `background: linear-gradient(
              180deg,
              rgba(0, 0, 0, 0) 50%,
              rgba(0, 0, 0, 0.5) 100%
            ),
            url(assets/images/restaurant-categories/${
              category.restaurantCategoryName === "Ăn vặt"
                ? "an-vat"
                : category.restaurantCategoryName
            }.jpg);
            min-width: 15rem;`;
  }

  goToRestaurantCategory(category: RestaurantCategory) {
    this.$router.navigate(["restaurants", category.id]);
  }
}
