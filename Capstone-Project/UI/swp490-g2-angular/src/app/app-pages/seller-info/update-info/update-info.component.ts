import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { NgForm, Validators } from "@angular/forms";
import { MessageService } from "primeng/api";
import { finalize } from "rxjs";
import { AuthenticationResponse, City, District } from "src/app/ngswag/client";

@Component({
  selector: "app-update-info",
  templateUrl: "./update-info.component.html"
})
export class UpdateInfoComponent implements AfterViewInit, OnInit{
  @ViewChild("form", { static: false }) form!: NgForm;
  selectedGender: any = null;
  dob: Date;
  genders: any[] = [
    { name: "Male", key: "M" },
    { name: "Female", key: "F" },
  ];

  uploadedFiles: any[] = [];
  $client: any;
  private _registerButtonDisabled: boolean;
  codeValidatorDialogVisible: boolean;
  $addressClient: any;
  cities: any;
  address: any;
  districts: any;
  wards: any;

  constructor(private messageService: MessageService) {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.form.controls["email"].addValidators([
        Validators.required,
        Validators.email,
      ]);
      this.form.controls["email"].updateValueAndValidity(); // !Important: this line must be added after validators created

      this.form.controls["phoneNumber"].addValidators([
        Validators.required,
        Validators.pattern("^(([+]84)[3|5|7|8|9]|0[3|5|7|8|9])+([0-9]{8})$"),
      ]);
      this.form.controls["phoneNumber"].updateValueAndValidity();

      this.$addressClient.getCities().subscribe((cities) => {
        this.cities = cities.sort(
          (a, b) => <number>a.cityName?.localeCompare(b.cityName!)
        );

        this.form.controls["city"].setValue(this.address?.ward?.district?.city);
      });

      if (this.address?.ward?.district?.city?.id) {
        this.$addressClient
          .getDistrictsByCityId(this.address?.ward?.district?.city?.id)
          .subscribe((districts) => {
            this.districts = districts.sort(
              (a, b) => <number>a.districtName?.localeCompare(b.districtName!)
            );

            this.form.controls["district"].setValue(
              this.address?.ward?.district
            );
          });
      }

      if (this.address?.ward?.district?.id) {
        this.$addressClient
          .getWardsByDistrictId(this.address?.ward?.district?.id)
          .subscribe((wards) => {
            this.wards = wards.sort(
              (a, b) => <number>a.wardName?.localeCompare(b.wardName!)
            );

            this.form.controls["ward"].setValue(this.address?.ward);
          });
      }

      if (this.address?.specificAddress) {
        this.form.controls["specificAddress"].setValue(
          this.address?.specificAddress
        );
      }
    }, 0);
  }

  onUpload(event) {
    for (const file of event.files) {
      this.uploadedFiles.push(file);
    }

    this.messageService.add({
      severity: "info",
      summary: "File Uploaded",
      detail: "",
    });
  }

  register(): void {
    this.$client
      .register(this.form.value)
      .pipe(
        finalize(() => {
          this._registerButtonDisabled = false;
        })
      )
      .subscribe({
        next: (authenticationResponse: AuthenticationResponse) => {
          if (authenticationResponse.errorMessage) {
            throw new Error(authenticationResponse.errorMessage);
          }
          this.codeValidatorDialogVisible = true;
        },
      });
  }

  ngOnInit() {
    this.selectedGender = this.genders[1];
  }

  changeProvince() {
    const selectedCity = <City | undefined>this.form.controls["city"]?.value;
    if (!selectedCity || !selectedCity.id) return;

    this.wards.length = 0;
    this.form.controls["ward"].setValue(undefined);
    this.form.controls["specificAddress"]?.setValue("");

    this.$addressClient
      .getDistrictsByCityId(selectedCity.id)
      .subscribe((districts) => (this.districts = districts));
  }

  changeDistrict() {
    const selectedDistrict = <District | undefined>(
      this.form.controls["district"]?.value
    );

    this.form.controls["specificAddress"]?.setValue("");

    if (!selectedDistrict || !selectedDistrict.id) return;

    this.$addressClient
      .getWardsByDistrictId(selectedDistrict.id)
      .subscribe((wards) => (this.wards = wards));
  }

  changeWard() {
    this.form.controls["specificAddress"]?.setValue("");
  }
}
