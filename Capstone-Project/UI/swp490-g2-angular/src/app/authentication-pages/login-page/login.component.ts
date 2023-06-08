import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { NgForm, Validators } from "@angular/forms";
import { Title } from "@angular/platform-browser";
import { Router, ActivatedRoute } from "@angular/router";
import { finalize, of, switchMap } from "rxjs";
import { AuthService } from "src/app/global/auth.service";
import { User } from "src/app/ngswag/client";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit, AfterViewInit {
  @ViewChild("form", { static: false }) form!: NgForm;
  user?: User;

  // To change title, we need to import title service
  constructor(
    $title: Title,
    private $router: Router,
    private $route: ActivatedRoute,
    private $auth: AuthService
  ) {
    $title.setTitle("Login");
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.form.controls["emailOrPhoneNumber"].addValidators([
        Validators.required,
      ]);
      this.form.controls["emailOrPhoneNumber"].updateValueAndValidity(); // !Important: this line must be added after validators created

      this.form.controls["password"].addValidators([Validators.required]);
      this.form.controls["password"].updateValueAndValidity();
    }, 0);
  }
  ngOnInit(): void {}

  login() {
    this._loginButtonDisabled = true;
    if (this.form.value.emailOrPhoneNumber.startsWith("+84")) {
      this.form.controls["emailOrPhoneNumber"].setValue(
        this.form.value.emailOrPhoneNumber.replace("+84", "0")
      );
    }

    this.$auth
      .login(this.form.value)
      .pipe(
        switchMap((response) => {
          if(response?.errorMessage) {
            throw new Error(response.errorMessage)
          }

          this.$router.navigate(["/"]);
          return of(undefined);
        }),
        finalize(() => {
          this._loginButtonDisabled = false;
        })
      )
      .subscribe();
  }

  private _loginButtonDisabled = false;
  get loginButtonDisabled(): boolean {
    return !!this.form?.invalid || this._loginButtonDisabled;
  }

  set registerButtonDisabled(value: boolean) {
    this._loginButtonDisabled = value;
  }

  navToRegister() {
    this.$router.navigate(["..", "register"], { relativeTo: this.$route });
    /**
     * /auth/login
     * /auth
     * /auth/register
     */
  }

  navToForgotPassword() {
    this.$router.navigate(["..", "forgot-password"], {
      relativeTo: this.$route,
    });
  }

  navToHome() {
    this.$router.navigate(["../.."], {
      relativeTo: this.$route,
    });
  }
}
