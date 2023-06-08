import { Address, BusinessException, User } from "../ngswag/client";

export * from "./CustomValidators";
export * from "./date";

export function getBusinessExceptionErrorCode(
  error: BusinessException
): number {
  if (error instanceof BusinessException)
    return JSON.parse(JSON.parse(error.response).message).errorCode;

  return -1;
}

export function getFullName(user?: User): string {
  if (!user) {
    return "";
  }

  return [user.lastName, user.middleName, user.firstName].join(" ");
}

export function getFullAddress(address?: Address): string {
  if (!address) return "";

  return `${address.specificAddress}, ${address.ward?.wardName}, ${address.ward?.district?.districtName}, ${address.ward?.district?.city?.cityName}`;
}

export function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371.071;
  const rlat1 = lat1 * (Math.PI / 180);
  const rlat2 = lat2 * (Math.PI / 180);
  const difflat = rlat2 - rlat1;
  const difflon = (lng2 - lng1) * (Math.PI / 180);
  return (
    2 *
    R *
    Math.asin(
      Math.sqrt(
        Math.sin(difflat / 2) * Math.sin(difflat / 2) +
          Math.cos(rlat1) *
            Math.cos(rlat2) *
            Math.sin(difflon / 2) *
            Math.sin(difflon / 2)
      )
    )
  );
}

export const PHONE_NUMBER_PATTERN = "^(([+]84)[3|5|7|8|9]|0[3|5|7|8|9])+([0-9]{8})$";

export function getLocal(key: string): any {
  const value = localStorage.getItem(key);
  if (!value) return {};

  try {
    return JSON.parse(value);
  } catch (e) {
    return {};
  }
}

export function setLocal(key: string, value: any): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export function removeLocal(key: string) {
  localStorage.removeItem(key);
}
