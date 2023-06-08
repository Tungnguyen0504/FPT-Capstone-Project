import { Component, OnInit } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import {
  Product,
  ProductCategory,
  ProductCategoryClient,
  ProductClient,
} from "src/app/ngswag/client";

@Component({
  selector: "app-add-product",
  templateUrl: "./add-product.component.html",
  styleUrls: ["./add-product.component.scss"],
})
export class AddProductComponent implements OnInit {
  invalid = false;
  restaurantId: number;
  productCategories: ProductCategory[];
  productForm: FormGroup;
  productImages: File[] = [];
  selectedCategories: any[] = [];
  constructor(
    private fb: FormBuilder,
    private $productClient: ProductClient,
    private $productCategoryClient: ProductCategoryClient,
    private $route: ActivatedRoute
  ) {
    const id: number = Number.parseInt(
      <string>this.$route.snapshot.paramMap.get("id")
    );
    this.restaurantId = id;
    this.productForm = this.fb.group({
      productName: ["", Validators.required],
      price: ["", [Validators.required, Validators.min(1)]],
      quantity: ["", [Validators.required, Validators.min(1)]],
      description: [""],
      productCategories: this.fb.array([])
    });
  }

  ngOnInit() {
    this.$productCategoryClient
      .getAllByRestaurantId(this.restaurantId)
      .subscribe((categories) => {
        this.productCategories = categories;
        console.log(this.productCategories);
        
        const categoryFormArray = this.productForm.get(
          "productCategories"
        ) as FormArray;
        categories.forEach(() =>
          categoryFormArray.push(this.fb.control(false))
        );
      });
  }
  onFileSelected(event: any) {
    this.productImages = event.target.files;
  }
  onSubmit() {

    if (this.productForm.valid) {
      console.log(this.productForm.value);

      const selectedCategories = this.productCategories
        .filter(
          (category, index) => this.productForm.value.productCategories[index]
        )
        .map((category) => ({
          id: category.id,
          productCategoryName: category.productCategoryName,
          toJSON: function () {
            // define a toJSON method for the object
            return {
              id: this.id,
              productCategoryName: this.productCategoryName,
            };
          },
        }));
  
      // const productInformationRequest = this.productForm.value;
      const body = {
        productName: this.productForm.value.productName,
        price: this.productForm.value.price,
        quantity: this.productForm.value.quantity,
        description: this.productForm.value.description,
        productCategories: selectedCategories,
      };
      console.log(body);
      this.$productClient
        .addNewProduct(this.restaurantId ,new Product(body as any))
        .subscribe((res) => console.log(res));
    }else{
      console.log("Please fill out all required fields and ensure that the price and quantity are valid.");
    }

  }
}
