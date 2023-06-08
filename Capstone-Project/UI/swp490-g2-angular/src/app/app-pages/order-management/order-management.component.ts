import { HttpClient } from "@angular/common/http";
import { Component, Input, NgZone, OnDestroy, OnInit } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { ConfirmationService, MessageService } from "primeng/api";
import { Subscription, map, of, switchMap } from "rxjs";
import {
  Address,
  FilterRequest,
  Order,
  OrderClient,
  OrderPaymentStatus,
  OrderProductDetail,
  OrderStatus,
  RestaurantClient,
  SearchRequest,
  User,
  UserClient,
} from "src/app/ngswag/client";
import { CartService } from "src/app/service/cart.service";
import { AddressService } from "src/app/shared/services/address.service";
import { getFullAddress, getFullName } from "src/app/utils";

@Component({
  selector: "app-order-management",
  templateUrl: "./order-management.component.html",
  styleUrls: ["./order-management.component.scss"],
})
export class OrderManagementComponent implements OnInit, OnDestroy {
  orders: Order[] = [];
  totalPrice = 0;
  visible = false;
  selectedOrder?: Order;
  selectedAbortReason: string;
  selectedRejectReason: string;
  selectedCancelReason: string;
  searchRequest = new SearchRequest({
    page: 0,
    size: 10,
    filters: [],
  });

  totalRecords = 0;
  loading = true;

  @Input() isBuyer = false;
  qrData?: string;
  bankImagePath?: string;
  currentUser?: User;
  navigationSubscription: Subscription;
  visibleAbortDialog: boolean;
  visibleRejectDialog: boolean;
  visibleCancelDialog: boolean;

  orderStatuses: OrderStatus[] = [
    "COMPLETED",
    "ACCEPTED",
    "DELIVERING",
    "PENDING",
    "CANCELLED",
    "ABORTED",
    "REJECTED",
  ];

  paymentStatuses: OrderPaymentStatus[] = [
    "NOT_PAID",
    "PAID",
    "NOT_REFUNDED",
    "REFUNDED",
  ];

  constructor(
    private $router: Router,
    private $cart: CartService,
    private $zone: NgZone,
    private $orderClient: OrderClient,
    private $message: MessageService,
    private $restaurantClient: RestaurantClient,
    private $http: HttpClient,
    private $userClient: UserClient,
    private $confirmation: ConfirmationService,
    private $address: AddressService
  ) {
    this.navigationSubscription = this.$router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        this.refresh();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }

  ngOnInit() {
    this.refresh();
  }

  getPaymentStatusTagInfo(paymentStatus: OrderPaymentStatus): {
    name: string;
    severity: "success" | "warning";
  } {
    const name = paymentStatus.replaceAll("_", " ");
    const severity =
      paymentStatus === "NOT_PAID" || paymentStatus === "NOT_REFUNDED"
        ? "warning"
        : "success";

    return {
      name: name,
      severity: severity,
    };
  }

  refresh() {
    this.loading = true;

    this.$userClient
      .getCurrentUser()
      .pipe(
        switchMap((user) => {
          this.currentUser = user;

          let role: string;
          if (this.isBuyer) role = "BUYER";
          else {
            if (this.currentUser.admin) role = "ADMIN";
            else role = "SELLER";
          }

          return this.$orderClient.getAllByRole(role, this.searchRequest);
        }),
        map((res) => {
          this.totalRecords = res.totalElements!;
          if (res.content) this.orders = res.content;

          this.loading = false;
        })
      )
      .subscribe();
  }

  getOrderTotalPrice(order: any): number {
    return order.orderProductDetails.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }

  getSeverity(status: string): string {
    switch (status) {
      case "PENDING":
        return "warning";
      case "DELIVERING":
        return "info";
      case "COMPLETED":
        return "success";
      case "ABORTED":
        return "danger";
      case "REJECTED":
        return "danger";
      case "CANCELLED":
        return "warning";
      default:
        return "";
    }
  }
  showDialog(id: number): void {
    this.visible = true;
    this.bankImagePath = undefined;
    this.qrData = undefined;
    this.selectedOrder = this.orders.find((item) => item.id === id);
    if (
      this.selectedOrder?.orderProductDetails?.length &&
      this.selectedOrder.orderProductDetails[0].product?.id
    ) {
      const r = this.selectedOrder.restaurant;
      if (!r) return;

      if (
        r.bankDetail?.accountName &&
        r.bankDetail?.accountNumber &&
        r.bankDetail?.acqId
      ) {
        this.$http
          .post<any>(
            "https://api.vietqr.io/v2/generate",
            {
              accountNo: r.bankDetail.accountNumber + "",
              accountName: r.bankDetail.accountName,
              acqId: r.bankDetail.acqId + "",
              addInfo: `Order ${this.selectedOrder?.id}`,
              amount: this.getOrderTotalPrice(this.selectedOrder) + "",
              template: "compact",
            },
            {
              headers: {
                "x-client-id": "4949cfcc-9672-4606-8482-d76dd49eddf0",
                "x-api-key": "6bc45654-fcd3-48ab-b312-3925213c0193",
                "Content-Type": "application/json",
              },
            }
          )
          .pipe(
            switchMap((res) => {
              if (!res) return of(undefined);

              if (res?.data?.qrCode) this.qrData = res.data.qrCode;
              this.bankImagePath = res.data.qrDataURL;

              return of(undefined);
            })
          )
          .subscribe();
      }
    }

    console.log(this.selectedOrder);
  }

  onPage(event: { first: number; rows: number; filters: any }) {
    if (event.filters?.orderStatus?.value) {
      const filter = this.searchRequest.filters?.find(
        (f) => f.key === "orderStatus"
      );

      if (filter) {
        filter.value = event.filters.orderStatus.value;
      } else {
        this.searchRequest.filters?.push(
          new FilterRequest({
            key: "orderStatus",
            operator: "EQUAL",
            value: event.filters.orderStatus.value,
          })
        );
      }
    } else {
      this.searchRequest.filters = this.searchRequest.filters?.filter(
        (f) => f.key !== "orderStatus"
      );
    }

    if (event.filters?.paymentStatus?.value) {
      const filter = this.searchRequest.filters?.find(
        (f) => f.key === "paymentStatus"
      );

      if (filter) {
        filter.value = event.filters.paymentStatus.value;
      } else {
        this.searchRequest.filters?.push(
          new FilterRequest({
            key: "paymentStatus",
            operator: "EQUAL",
            value: event.filters.paymentStatus.value,
          })
        );
      }
    } else {
      this.searchRequest.filters = this.searchRequest.filters?.filter(
        (f) => f.key !== "paymentStatus"
      );
    }

    this.searchRequest.page = event.first / event.rows;
    this.searchRequest.size = event.rows;
    this.refresh();
  }

  accept() {
    this.$confirmation.confirm({
      message: "Do you want to accept this order?",
      header: "Accept",
      accept: () => {
        if (!this.selectedOrder?.id) return;

        this.$orderClient
          .accept(this.selectedOrder.id)
          .pipe(
            map((errorMessage) => {
              if (errorMessage) throw new Error(errorMessage);

              this.$message.add({
                severity: "success",
                summary: "Accepted",
                detail: `Order #${this.selectedOrder?.id} has been accepted!`,
              });

              this.visible = false;
              this.refresh();
            })
          )
          .subscribe();
      },
    });
  }

  reject() {
    this.$confirmation.confirm({
      message: "Do you want to reject this order?",
      header: "Reject",
      accept: () => {
        if (!this.selectedOrder?.id) return;

        this.$orderClient
          .reject(this.selectedOrder.id, this.selectedRejectReason)
          .pipe(
            map((errorMessage) => {
              if (errorMessage) throw new Error(errorMessage);

              this.$message.add({
                severity: "warn",
                summary: "Rejected",
                detail: `Order #${this.selectedOrder?.id} has been rejected!`,
              });

              this.visible = false;
              this.refresh();
            })
          )
          .subscribe();
      },
    });
  }

  cancel() {
    this.$confirmation.confirm({
      message: "Do you want to cancel this order?",
      header: "Cancel",
      accept: () => {
        if (!this.selectedOrder?.id) return;

        this.$orderClient
          .cancel(this.selectedOrder.id, this.selectedCancelReason)
          .pipe(
            map((errorMessage) => {
              if (errorMessage) throw new Error(errorMessage);

              this.$message.add({
                severity: "warn",
                summary: "Cancelled",
                detail: `Order #${this.selectedOrder?.id} has been cancelled!`,
              });

              this.visible = false;
              this.refresh();
            })
          )
          .subscribe();
      },
    });
  }

  startDelivery() {
    this.$confirmation.confirm({
      message: "Do you want to start delivering this order?",
      header: "Start Delivering",
      accept: () => {
        if (!this.selectedOrder?.id) return;

        this.$orderClient
          .deliver(this.selectedOrder.id)
          .pipe(
            map((errorMessage) => {
              if (errorMessage) throw new Error(errorMessage);

              this.$message.add({
                severity: "success",
                summary: "Delivery started",
                detail: `Order #${this.selectedOrder?.id} has been started delivering!`,
              });

              this.visible = false;
              this.refresh();
            })
          )
          .subscribe();
      },
    });
  }

  showAbortDialog() {
    this.visibleAbortDialog = true;
  }

  showRejectDialog() {
    this.visibleRejectDialog = true;
  }

  showCancelDialog() {
    this.visibleCancelDialog = true;
  }

  abort() {
    this.$confirmation.confirm({
      message: "Do you want to abort this order?",
      header: "Abort",
      accept: () => {
        if (!this.selectedOrder?.id) return;

        this.$orderClient
          .abort(this.selectedOrder.id, this.selectedAbortReason)
          .pipe(
            map((errorMessage) => {
              if (errorMessage) throw new Error(errorMessage);

              this.$message.add({
                severity: "warn",
                summary: "Delivery aborted",
                detail: `Delivery of order #${this.selectedOrder?.id} has been aborted!`,
              });

              this.visible = false;
              this.refresh();
            })
          )
          .subscribe();
      },
    });
  }

  complete() {
    this.$confirmation.confirm({
      message: "Do you want to complete this order?",
      header: "Complete",
      accept: () => {
        if (!this.selectedOrder?.id) return;

        this.$orderClient
          .complete(this.selectedOrder.id)
          .pipe(
            map((errorMessage) => {
              if (errorMessage) throw new Error(errorMessage);

              this.$message.add({
                severity: "success",
                summary: "Delivery completed",
                detail: `Delivery of order #${this.selectedOrder?.id} has been completed!`,
              });

              this.visible = false;
              this.refresh();
            })
          )
          .subscribe();
      },
    });
  }

  get showQr(): boolean {
    if (!this.isBuyer) return false;

    if (
      this.selectedOrder?.orderStatus === "ABORTED" ||
      this.selectedOrder?.orderStatus === "PENDING" ||
      this.selectedOrder?.orderStatus === "REJECTED" ||
      this.selectedOrder?.orderStatus === "CANCELLED" ||
      !this.selectedOrder?.restaurant
    ) {
      return false;
    }

    return !!(
      this.selectedOrder.restaurant?.bankDetail?.accountName &&
      this.selectedOrder.restaurant?.bankDetail?.accountNumber &&
      this.selectedOrder.restaurant?.bankDetail?.acqId
    );
  }

  addToCart(order: Order): void {
    console.log(order?.restaurant?.id);
    console.log(this.$cart.restaurant$.value?.id);
    if (
      this.$cart.restaurant$.value?.id !== undefined &&
      this.$cart.restaurant$.value?.id !== order?.restaurant?.id
    ) {
      throw new Error("You need to empty the cart before do this action!");
    }

    order.orderProductDetails?.map((o) => {
      const orderProductDetail: OrderProductDetail = new OrderProductDetail({
        product: o.product,
        quantity: 1,
        price: o.product?.price,
      });

      if (order.restaurant)
        this.$cart.addToCart(orderProductDetail, order.restaurant);
    });

    this.$zone.run(() => {
      this.$message.add({
        severity: "success",
        summary: "Success",
        detail: "Order is added to cart again!",
      });
    });

    this.$router.navigateByUrl(`/restaurant/${order.restaurant?.id}`);
  }

  getFullName(user?: User) {
    return getFullName(user);
  }

  getFullAddress(address?: Address) {
    return getFullAddress(address);
  }

  getPaymentStatus(order: Order):
    | {
        name: string;
        severity: "success" | "warning";
      }
    | undefined {
    let severity: "success" | "warning" | undefined = undefined;
    if (order.paymentStatus === "PAID" || order.paymentStatus === "REFUNDED")
      severity = "success";
    else if (
      order.paymentStatus === "NOT_PAID" ||
      order.paymentStatus === "NOT_REFUNDED"
    ) {
      severity = "warning";
    }

    if (!severity) return undefined;

    if (
      order.orderStatus === "ACCEPTED" ||
      order.orderStatus === "DELIVERING" ||
      order.orderStatus === "COMPLETED"
    ) {
      if (!order.paymentStatus) return undefined;

      return {
        name: order.paymentStatus.replace("_", " "),
        severity: severity,
      };
    }

    if (order.orderStatus === "ABORTED") {
      if (!order.paymentStatus) return undefined;

      return {
        name: order.paymentStatus.replace("_", " "),
        severity: severity,
      };
    }

    return undefined;
  }

  receivePayment() {
    this.$confirmation.confirm({
      message: "Have you received payment from the buyer?",
      header: "Payment received?",
      accept: () => {
        if (!this.selectedOrder?.id) return;

        this.$orderClient
          .receivePayment(this.selectedOrder.id)
          .pipe(
            map((errorMessage) => {
              if (errorMessage) throw new Error(errorMessage);

              this.$message.add({
                severity: "success",
                summary: "Payment received",
                detail: `Payment for order #${this.selectedOrder?.id} has been received!`,
              });

              this.visible = false;
              this.refresh();
            })
          )
          .subscribe();
      },
    });
  }

  refund() {
    this.$confirmation.confirm({
      message: "Have you refunded payment to the buyer?",
      header: "Payment refunded?",
      accept: () => {
        if (!this.selectedOrder?.id) return;

        this.$orderClient
          .refund(this.selectedOrder.id)
          .pipe(
            map((errorMessage) => {
              if (errorMessage) throw new Error(errorMessage);

              this.$message.add({
                severity: "success",
                summary: "Payment refunded",
                detail: `Payment for order #${this.selectedOrder?.id} has been refunded!`,
              });

              this.visible = false;
              this.refresh();
            })
          )
          .subscribe();
      },
    });
  }

  getAbortReason(orderId: number): string {
    if (!orderId) return "";

    let msg = "";
    this.$orderClient
      .getTicketByOrderIdAndStatus(orderId, "ABORTED")
      .subscribe((ticket) => {
        if (ticket.message) msg = ticket.message;
      });
    return msg;
  }
}
