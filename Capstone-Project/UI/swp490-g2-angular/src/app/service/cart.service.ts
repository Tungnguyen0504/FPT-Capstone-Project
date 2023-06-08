import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of, switchMap } from "rxjs";
import {
  Address,
  Order,
  OrderClient,
  OrderProductDetail,
  Restaurant,
} from "../ngswag/client";
import { AuthService } from "../global/auth.service";
import { getLocal, removeLocal, setLocal } from "../utils";
import { OrderService } from "./order.service";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

@Injectable({
  providedIn: "root",
})
export class CartService {
  order$ = new BehaviorSubject<Order>(Order.fromJS({}));
  restaurant$ = new BehaviorSubject<Restaurant | undefined>(undefined);
  private CART_STORAGE_KEY = "";
  private RESTAURANT_STORAGE_KEY = "";

  constructor(
    private $auth: AuthService,
    private $orderClient: OrderClient,
    private $order: OrderService
  ) {
    this.refresh().subscribe();
  }

  refresh() {
    return this.$auth.getCurrentUser().pipe(
      switchMap((user) => {
        if (!user) return of(undefined);

        this.CART_STORAGE_KEY = `order/${user.id}`;
        this.RESTAURANT_STORAGE_KEY = `order/restaurant/${user.id}`;
        this.order$.next(Order.fromJS(getLocal(this.CART_STORAGE_KEY)));

        const restaurant = new Restaurant(
          getLocal(this.RESTAURANT_STORAGE_KEY)
        );
        this.restaurant$.next(restaurant);
        return of(undefined);
      })
    );
  }

  addToCart(orderProductDetail: OrderProductDetail, restaurant: Restaurant) {
    this.restaurant$.next(restaurant);
    setLocal(this.RESTAURANT_STORAGE_KEY, restaurant.toJSON());

    const order = this.order$.value;
    if (!order.orderProductDetails) order.orderProductDetails = [];

    const existed = order.orderProductDetails.some((opd, index) => {
      if (opd.product?.id === orderProductDetail.product?.id) {
        if (orderProductDetail.quantity) {
          order.orderProductDetails![index] = orderProductDetail.clone();
        } else {
          order.orderProductDetails?.splice(index, 1);
        }

        return true;
      }

      return false;
    });

    if (!existed) {
      order.orderProductDetails.push(orderProductDetail);
    }

    order.destinationAddress = Address.fromJS(order.destinationAddress);
    this.order$.next(order);
    setLocal(this.CART_STORAGE_KEY, order.toJSON());
  }

  removeFromCart(orderProductDetail: OrderProductDetail) {
    const order = this.order$.value;
    if (!order.orderProductDetails) return;

    const index = order.orderProductDetails.findIndex(
      (i) => i.id === orderProductDetail.id
    );
    if (index >= 0) {
      order.orderProductDetails.splice(index, 1);
      this.order$.next(order);
      setLocal(this.CART_STORAGE_KEY, order.toJSON());
    }

    if (!order.orderProductDetails.length) {
      this.restaurant$.next(undefined);
      removeLocal(this.RESTAURANT_STORAGE_KEY);
    }
  }

  clearCart() {
    const order = this.order$.value;
    if (!order.orderProductDetails) return;

    order.orderProductDetails.length = 0;
    this.order$.next(order);
    setLocal(this.CART_STORAGE_KEY, order.toJSON());

    this.restaurant$.next(undefined);
    removeLocal(this.RESTAURANT_STORAGE_KEY);
  }

  getOrderObservable(): Observable<Order> {
    return this.order$.asObservable();
  }

  addOrder(): Observable<string> {
    const order = this.order$.value;
    return this.$orderClient.insert(order).pipe(
      switchMap((errorMessage) => {
        if (!errorMessage) {
          this.clearCart();
        }

        return of(errorMessage);
      })
    );
  }

  get itemCount(): number {
    const order = this.order$.value;
    return order.orderProductDetails?.length || 0;
  }
}
