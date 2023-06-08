import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { ConfirmationService, MessageService } from "primeng/api";
import { of, switchMap } from "rxjs";
import {
  FilterRequest,
  Order,
  OrderProductDetail,
  Product,
  ProductClient,
  Restaurant,
  SearchRequest,
} from "src/app/ngswag/client";
import { CartService } from "src/app/service/cart.service";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-cart-pages",
  templateUrl: "./cart-pages.component.html",
  styleUrls: ["./cart-pages.component.scss"],
})
export class CartPagesComponent implements OnInit {
  @ViewChild("sideBar", { static: false }) sideBar: ElementRef;

  order?: Order;
  totalPrice = 0;
  visibleDialog: boolean;
  verticalOffset = 0;
  products: Product[] = [];
  @Input() isSideBar = true;
  @Output() orderAdded = new EventEmitter();

  constructor(
    private $router: Router,
    private $route: ActivatedRoute,
    private $cart: CartService,
    private $productClient: ProductClient,
    private $message: MessageService,
    private $confirmation: ConfirmationService
  ) {}

  refresh() {
    this.$cart
      .refresh()
      .pipe(
        switchMap(() => {
          return this.$cart.getOrderObservable();
        }),
        switchMap((order) => {
          this.order = order;
          this.calculateTotal();

          if (
            order.orderProductDetails?.length &&
            this.$cart.restaurant$.value
          ) {
            return this.$productClient.search(
              this.$cart.restaurant$.value.id!,
              new SearchRequest({
                filters: [
                  new FilterRequest({
                    key: "id",
                    operator: "IN",
                    fieldType: "LONG",
                    values: order.orderProductDetails?.map(
                      (opd) => opd.product?.id
                    ),
                  }),
                ],
              })
            );
          }

          return of(undefined);
        }),
        switchMap((page) => {
          if (page?.content) this.products = page.content;

          return of();
        })
      )
      .subscribe();
  }

  calculateTotal(newNumber?: number, detail?: OrderProductDetail) {
    if (newNumber !== undefined && detail) {
      detail.quantity = newNumber;
    }

    if (this.order?.orderProductDetails?.length) {
      this.totalPrice = this.order.orderProductDetails
        .map((item) => item.price! * item.quantity!)
        .reduce((prevPrice, currPrice) => prevPrice + currPrice);
    }
  }

  ngOnInit() {
    this.refresh();
  }

  get hasOrder(): boolean {
    return !!this.order?.orderProductDetails?.some((opd) => opd.quantity);
  }

  @HostListener("window:scroll", []) onWindowScroll() {
    // do some stuff here when the window is scrolled
    this.verticalOffset =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;
  }

  getProduct(detail: OrderProductDetail): Product | undefined {
    return this.products.find((p) => p.id === detail.product?.id);
  }

  remove(detail: OrderProductDetail) {
    this.$confirmation.confirm({
      header: "Confirmation",
      message:
        this.isSideBar || this.$cart.itemCount > 1
          ? "Are you sure that you want to remove this item?"
          : "Are you sure that you want to empty the cart and navigate to the restaurant?",
      accept: () => {
        const restaurantId = this.restaurant?.id;
        this.$cart.removeFromCart(detail);
        if (!this.isSideBar && !this.$cart.itemCount) {
          this.$router.navigate(["restaurant", restaurantId]);
        }
      },
    });
  }

  emptyCart() {
    this.$confirmation.confirm({
      header: "Confirmation",
      message: this.isSideBar
        ? "Are you sure that you want to empty the cart?"
        : "Are you sure that you want to empty the cart and navigate to the restaurant?",
      accept: () => {
        const restaurantId = this.restaurant?.id;
        this.$cart.clearCart();
        if (!this.isSideBar) {
          this.$router.navigate(["restaurant", restaurantId]);
        }
      },
    });
  }

  addOrder() {
    if (this.isSideBar) {
      this.sideBar.nativeElement.classList.add("hidden");
      this.$router.navigate(["cart-pages", "order-information"]);
    } else {
      this.orderAdded.emit();
    }
  }

  get restaurant(): Restaurant | undefined {
    return this.$cart.restaurant$.value;
  }

  navToOrderInformation() {
    this.$router.navigate(["order-information"], {
      relativeTo: this.$route,
    });
  }
}
