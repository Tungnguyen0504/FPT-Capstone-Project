import { Component, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { finalize, of, switchMap } from "rxjs";
import {
  File,
  Product,
  ProductCategory,
  ProductCategoryClient,
  ProductClient,
} from "src/app/ngswag/client";

@Component({
  selector: "app-product",
  templateUrl: "./product.component.html",
  styleUrls: ["./product.component.scss"],
})
export class ProductComponent implements OnInit {
  @ViewChild("form", { static: false }) form!: NgForm;
  productId: number | undefined;
  restaurantId: number;
  product: Product = new Product({
    categories: [],
    images: [],
    productStatus: "ACTIVE",
  });

  productCategoryNames: string[] = [];
  allCategories: ProductCategory[] = [];
  draggedProductCategory?: ProductCategory;

  constructor(
    private $router: Router,
    private $route: ActivatedRoute,
    private $productClient: ProductClient,
    private $message: MessageService,
    private $productCategoryClient: ProductCategoryClient
  ) {
    this.productId = Number.parseInt(
      <string>this.$route.snapshot.paramMap.get("productId")
    );

    this.restaurantId = Number.parseInt(
      <string>this.$route.snapshot.paramMap.get("id")
    );
  }

  refresh() {
    if (this.productId) {
      this.$productClient.getById(this.productId).subscribe((product) => {
        this.product = product;
        if (this.product.categories)
          this.productCategoryNames = this.product.categories?.map(
            (c) => c.productCategoryName!
          );
      });
    }

    this.$productCategoryClient
      .getAllByRestaurantId(this.restaurantId)
      .subscribe((categories) => (this.allCategories = categories));
  }

  ngOnInit(): void {
    this.refresh();
  }

  addImage(image: File) {
    if (!this.product) return;
    if (!this.product.images) this.product.images = [];
    this.product.images.push(image);
    this.$productClient.update(this.product).subscribe(() => location.reload());
  }

  onSubmit() {
    this._submitButtonDisabled = true;

    const apiCall = this.productId
      ? this.$productClient.update(this.product).pipe(
          switchMap(() => {
            return of("");
          })
        )
      : this.$productClient.addNewProduct(this.restaurantId, this.product);

    apiCall
      .pipe(
        switchMap((errorMessage: string | undefined) => {
          if (errorMessage) throw new Error(errorMessage);

          this.$message.add({
            severity: "success",
            summary: "Success",
            detail: `Product [${
              this.product.productName
            }] has been successfully ${this.productId ? "updated" : "added"}!`,
          });
          this.$router.navigate([`/restaurant/${this.restaurantId}`]);
          return of();
        }),
        finalize(() => {
          this._submitButtonDisabled = false;
        })
      )
      .subscribe();
  }

  private _submitButtonDisabled = false;
  get submitButtonDisabled(): boolean {
    return (
      !this.productCategoryNames.length ||
      !!this.form?.invalid ||
      this._submitButtonDisabled
    );
  }

  deleteImage(image: File) {
    if (!this.productId || !image.id) return;

    this.$productClient.deleteImage(this.productId, image.id).subscribe(() => {
      this.$message.add({
        severity: "success",
        summary: "Success",
        detail: "Image has been deleted successfully!",
      });

      this.refresh();
    });
  }

  changeProductCategory(productCategoryNames: string[]) {
    if (!this.product.categories) {
      return;
    }

    this.product.categories.forEach((c) => {
      if (productCategoryNames.every((pcn) => pcn !== c.productCategoryName)) {
        this.product.categories = this.product.categories?.filter(
          (c2) => c2.id !== c.id
        );
      }
    });

    productCategoryNames.forEach((pcn) => {
      const category = this.allCategories?.find(
        (c) => c.productCategoryName === pcn
      );
      if (category) {
        if (this.product.categories?.every((c) => c.id !== category.id)) {
          this.product.categories.push(category);
        }
      } else {
        if (
          this.product.categories?.every((c) => c.productCategoryName !== pcn)
        ) {
          this.product.categories?.push(
            new ProductCategory({
              productCategoryName: pcn,
            })
          );
        }
      }
    });

    this.productCategoryNames = [
      ...this.product.categories.map((c) => c.productCategoryName!),
    ];
  }

  dragStart(category: ProductCategory) {
    this.draggedProductCategory = category;
  }

  drop() {
    if (
      this.draggedProductCategory &&
      !this.productCategoryNames.includes(this.draggedProductCategory.productCategoryName!)
    ) {
      this.productCategoryNames.push(this.draggedProductCategory.productCategoryName!);
      this.changeProductCategory(this.productCategoryNames);
      this.draggedProductCategory = undefined;
    }
  }

  dragEnd() {
    this.draggedProductCategory = undefined;
  }
}
