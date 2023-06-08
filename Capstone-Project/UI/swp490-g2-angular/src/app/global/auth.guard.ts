import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from "@angular/router";
import { Observable, of, switchMap } from "rxjs";
import { Client } from "../ngswag/client";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(
    private $client: Client,
    private $auth: AuthService,
    private $router: Router
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  canActivate(
    route: ActivatedRouteSnapshot,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    const isAuthenticated = this.$auth.isLoggedIn();
    if (!isAuthenticated) {
      this.$router.navigate([""]);
    }

    const roles: string[] = route.data["roles"];
    if (!Array.isArray(roles))
      throw new Error("'roles' must be defined in the data besides AuthGuard.");

    return this.$auth.getCurrentUser().pipe(
      switchMap((user) => {
        if (!user || !user.roles) {
          this.$router.navigate([""]);
          return of();
        }

        if (user.roles.some((role) => roles.includes(role))) {
          return of(true);
        }

        return of(false);
      })
    );
  }
}
