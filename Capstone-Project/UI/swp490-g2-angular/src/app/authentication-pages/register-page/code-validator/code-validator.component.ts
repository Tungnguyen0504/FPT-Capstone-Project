import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from "@angular/core";
import { NgForm, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ConfirmationService } from "primeng/api";
import { finalize } from "rxjs";
import { AuthService } from "src/app/global/auth.service";
import { UserClient } from "src/app/ngswag/client";
import { CustomValidators } from "src/app/utils";

@Component({
  selector: "app-code-validator",
  templateUrl: "./code-validator.component.html",
  styleUrls: ["./code-validator.component.scss"],
})
export class CodeValidatorComponent implements OnInit, AfterViewInit {
  @ViewChild("form", { static: false }) form!: NgForm;
  visible = true;
  @Input() email: any;
  @Input() password: any;

  constructor(
    private $confirmation: ConfirmationService,
    private $auth: AuthService,
    private $client: UserClient,
    private $router: Router,
    private $route: ActivatedRoute
  ) { }

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.form.controls["code"].addValidators([
        Validators.required,
        CustomValidators.patternValidator(/^[0-9]{6}$/, { hasNumber: true }),
      ]);
      this.form.controls["code"].updateValueAndValidity();
    }, 0);
  }

  async submit() {
    this._buttonDisabled = true;
    this.$client
      .verifyCode(this.email, this.form.controls["code"].value, false)
      .pipe(
        finalize(() => {
          this._buttonDisabled = false;
        })
      )
      .subscribe({
        next: (errorMessage) => {
          if (!errorMessage) {
            return this.$confirmation.confirm({
              message: "Register successfully! Click “YES” to back to home page.",
              header: "Confirmation",
              accept: () => {
                const requestLogin = {
                  emailOrPhoneNumber: this.email,
                  password: this.password
                }
                this.$auth
                  .login(requestLogin)
                  .subscribe({
                    next: () => {
                      this.$router.navigate(["/"]);
                    },
                  });
              },
              reject: () => { },
            });
          }

          throw new Error(errorMessage);
        },
      });
  }

  private _buttonDisabled = false;
  get buttonDisabled(): boolean {
    return !!this.form?.invalid || this._buttonDisabled;
  }
}
