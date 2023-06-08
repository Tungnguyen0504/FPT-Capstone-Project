import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, of } from "rxjs";
import { catchError, switchMap } from "rxjs/operators";
import { User, AuthenticationRequest, UserClient } from "../ngswag/client";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private readonly JWT_TOKEN = "JWT_TOKEN";
  private _currentUser?: User;
  private readonly whiteList = ["/restaurants", "/restaurant"];

  constructor(private $client: UserClient, private $router: Router) {}

  private get inWhiteList(): boolean {
    return this.whiteList.some((url) => this.$router.url.includes(url));
  }

  getCurrentUser(forceRefresh = false): Observable<User | undefined> {
    if (!forceRefresh && this._currentUser) return of(this._currentUser);

    return this.$client.getCurrentUser().pipe(
      switchMap((user) => {
        if (!user || !user.id) {
          if (this.inWhiteList) return of(undefined);

          this.logout(false);
          return of(undefined);
        }

        this._currentUser = user;
        return of(user);
      }),
      catchError(() => {
        this.logout(false);
        return of(undefined);
      })
    );
  }

  login(request: { emailOrPhoneNumber: string; password: string }) {
    return this.$client
      .login(
        new AuthenticationRequest({
          emailOrPhoneNumber: request.emailOrPhoneNumber,
          password: request.password,
        })
      )
      .pipe(
        switchMap((response) => {
          if (response.errorMessage) {
            throw new Error(response.errorMessage);
          }

          if (response.token) {
            localStorage.setItem(this.JWT_TOKEN, response.token);
          }

          return of(response);
        })
      );
  }

  logout(forceNavigateToLogin = true) {
    this._currentUser = undefined;
    localStorage.removeItem(this.JWT_TOKEN);

    if (forceNavigateToLogin) this.$router.navigate(["auth", "login"]);
    else this.$router.navigate([""]);
  }

  isLoggedIn(): boolean {
    return !!this.getJwtToken();
  }

  getJwtToken() {
    return localStorage.getItem(this.JWT_TOKEN);
  }

  static isAdmin(user?: User): boolean {
    return !!user?.roles?.includes("ADMIN");
  }

  static isBuyer(user?: User): boolean {
    return !!user?.roles?.includes("BUYER");
  }

  static isSeller(user?: User): boolean {
    return !!user?.roles?.includes("SELLER");
  }
}
