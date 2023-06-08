import { Injectable } from "@angular/core";
import { Address } from "src/app/ngswag/client";

@Injectable({
  providedIn: "root",
})
export class AddressService {
  constructor() {}

  isValid(address?: Address): boolean {
    if (!address) return false;

    if (!address.specificAddress || !address.ward?.id) return false;

    return true;
  }
}
