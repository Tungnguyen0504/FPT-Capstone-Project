import { HttpClient } from "@angular/common/http";
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  NgZone,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { FormGroup, NgForm, Validators } from "@angular/forms";
import { ConfirmationService, MessageService } from "primeng/api";
import { finalize, of, switchMap } from "rxjs";
import {
  BankDetail,
  Restaurant,
  RestaurantCategory,
  RestaurantCategoryClient,
  RestaurantClient,
  Ward,
} from "src/app/ngswag/client";
import { PHONE_NUMBER_PATTERN } from "src/app/utils";

@Component({
  selector: "app-restaurant-update-information",
  templateUrl: "./restaurant-update-information.component.html",
  styleUrls: ["./restaurant-update-information.component.scss"],
})
export class RestaurantUpdateInformationComponent
  implements OnInit, AfterViewInit
{
  @Input() restaurant: Restaurant;
  @Input() editable: boolean;
  @ViewChild("form", { static: false }) form!: NgForm;
  @Output() hidden = new EventEmitter();
  categories: RestaurantCategory[] = [];
  openTimeFormGroup = new FormGroup({});

  displayModal = false;
  private _submitButtonDisabled = false;
  get submitButtonDisabled(): boolean {
    return !!this.form?.invalid || this._submitButtonDisabled;
  }

  banksData: any[] = [];
  selectedBank?: any;
  acqIds: number[] = [];
  showError = false;
  constructor(
    private $restaurantClient: RestaurantClient,
    private $confirmation: ConfirmationService,
    private $message: MessageService,
    private $restaurantCategoryClient: RestaurantCategoryClient,
    private $http: HttpClient,
    private $zone: NgZone
  ) {}

  ngOnInit(): void {
    if (!this.restaurant.bankDetail)
      this.restaurant.bankDetail = new BankDetail();

    this.$http
      .get("https://api.vietqr.io/v2/banks")
      .pipe(
        switchMap((res: any) => {
          if (!res?.data) return of(undefined);

          this.banksData = res.data;
          // console.log(this.banksData);

          if (this.restaurant.bankDetail?.acqId) {
            setTimeout(() => {
              this.selectedBank = this.banksData.find(
                (x) => x.bin === this.restaurant.bankDetail?.acqId
              );
            });
          }

          return of(undefined);
        })
      )
      .subscribe();
  }

  ngAfterViewInit(): void {
    this.form.valueChanges!.subscribe(() => {
      this.showError = !this.form.valid;
    });
    this.$restaurantCategoryClient
      .getAll()
      .pipe(
        switchMap((categories) => {
          this.categories = [...categories];
          return of();
        })
      )
      .subscribe();

    setTimeout(() => {
      this.form.controls["phoneNumber"].addValidators([
        Validators.required,
        Validators.pattern(PHONE_NUMBER_PATTERN),
      ]);
      this.form.controls["phoneNumber"].updateValueAndValidity();
      this.form.controls["bankDetail_accountNumber"].addValidators([
        Validators.required,
        Validators.pattern("^[0-9]{9,15}$"),
      ]);
      if (!this.editable) {
        this.form.control.disable();
      }
    });
  }

  showDialog() {
    this.displayModal = true;
  }

  submit(): void {
    this._submitButtonDisabled = true;
    if (this.restaurant.address) {
      this.restaurant.address.ward = new Ward({
        id: this.form.value.ward.id,
      });

      this.restaurant.address.specificAddress = this.form.value.specificAddress;
    }

    if (this.selectedBank && this.restaurant.bankDetail) {
      this.restaurant.bankDetail.acqId = this.selectedBank.bin;
    }

    this.$restaurantClient
      .update(this.restaurant)
      .pipe(
        finalize(() => {
          this._submitButtonDisabled = false;
        })
      )
      .subscribe(() => {
        this.$message.add({
          severity: "success",
          summary: "Success",
          detail: "Restaurant's information has changed",
        });

        this.displayModal = false;
      });
  }

  onDialogHide() {
    this.hidden.emit();
  }
}
