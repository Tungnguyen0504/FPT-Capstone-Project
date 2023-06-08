import { AfterViewInit, Component, Input, OnInit } from "@angular/core";
import { ControlContainer, NgForm } from "@angular/forms";
import { GoogleMapService } from "src/app/global/google-map.service";
import {
  Address,
  AddressClient,
  City,
  District,
  Ward,
} from "src/app/ngswag/client";

@Component({
  selector: "app-address-fields",
  templateUrl: "./address-fields.component.html",
  styleUrls: ["./address-fields.component.scss"],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: NgForm,
    },
  ],
})
export class AddressFieldsComponent implements OnInit, AfterViewInit {
  cities: City[] = [];
  districts: District[] = [];
  wards: Ward[] = [];
  timeout: any;
  @Input() address?: Address;

  constructor(
    private $addressClient: AddressClient,
    private $googleMap: GoogleMapService,
    public form: NgForm
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.$addressClient.getCities().subscribe((cities) => {
        this.cities = cities.sort(
          (a, b) => <number>a.cityName?.localeCompare(b.cityName!)
        );
      });

      if (this.address?.specificAddress) {
        this.form.controls["city"].setValue(this.address?.ward?.district?.city);

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

        this.form.controls["specificAddress"].setValue(
          this.address?.specificAddress
        );
      }
    });
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
