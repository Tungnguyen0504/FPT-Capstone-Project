import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from "@angular/core";
import { NgForm, Validators } from "@angular/forms";
import { Title } from "@angular/platform-browser";
import { Router, ActivatedRoute } from "@angular/router";
import { MessageService } from "primeng/api";
import { finalize } from "rxjs";
import {
  AuthenticationResponse,
  ChangePasswordRequest,
  User,
  UserClient,
} from "src/app/ngswag/client";
import { CustomValidators } from "src/app/utils";

@Component({
  selector: "app-forgot-pass-page",
  templateUrl: "./forgot-pass-page.component.html",
  styleUrls: ["./forgot-pass-page.component.scss"],
})
export class ForgotPassPageComponent implements AfterViewInit, OnInit {
  @ViewChild("form", { static: false }) form!: NgForm;
  codeValidatorDialogVisible = true;
  user?: User;
  verificationCodeShown = false;
  passwordsShown = false;
  @Input() isChangingPassword = false;

  // To change title, we need to import title service
  constructor(
    $title: Title,
    private $router: Router,
    private $route: ActivatedRoute,
    private $userClient: UserClient,
    private $message: MessageService
  ) {
    $title.setTitle("Forgot Password");
  }
  ngOnInit(): void {
    if (this.isChangingPassword) {
      this.verificationCodeShown = false;
      this.passwordsShown = true;

      this.$userClient.getCurrentUser().subscribe((user) => (this.user = user));
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (!this.isChangingPassword) {
        this.form.controls["emailOrPhoneNumber"].addValidators([
          Validators.required,
        ]);
        this.form.controls["emailOrPhoneNumber"].updateValueAndValidity();
      }
    }, 0);
  }

  async forgotPassword(): Promise<void> {}

  private _fgtPassButtonDisabled = false;
  get fgtPassButtonDisabled(): boolean {
    return !!this.form?.invalid || this._fgtPassButtonDisabled;
  }

  set registerButtonDisabled(value: boolean) {
    this._fgtPassButtonDisabled = value;
  }

  navToLogin() {
    this.$router.navigate(["..", "login"], { relativeTo: this.$route });
  }

  navToRegister() {
    this.$router.navigate(["..", "register"], { relativeTo: this.$route });
  }

  private changePassword() {
    this.$userClient
      .changePassword(
        new ChangePasswordRequest({
          emailOrPhoneNumber: this.isChangingPassword
            ? this.user?.email
            : this.form.controls["emailOrPhoneNumber"].getRawValue(),
          password: this.form.value.password,
          currentPasswordRequired: this.isChangingPassword,
          currentPassword: this.form.value.currentPassword,
        })
      )
      .pipe(finalize(() => {}))
      .subscribe((response: AuthenticationResponse) => {
        if (response.errorMessage) {
          this.$message.add({
            severity: "error",
            summary: "Error",
            detail: response.errorMessage,
          });

          this._fgtPassButtonDisabled = false;
        } else {
          this.$message.add({
            severity: "success",
            summary: "Success",
            detail: "Password has been changed successfully!",
          });

          this.form.control.disable();
          this.$router.navigate([
            this.isChangingPassword ? "/" : "/auth/login",
          ]);
        }
      });
  }

  onVerificationCodeClicked() {
    this._fgtPassButtonDisabled = true;
    if (this.passwordsShown) {
      return this.changePassword();
    }

    if (!this.verificationCodeShown) {
      this.$userClient
        .sendVerificationCode(this.form.value.emailOrPhoneNumber)
        .subscribe(() => {
          this.$message.add({
            severity: "success",
            summary: "Success",
            detail: "A verification code has been sent to your phone number!",
          });
          this.verificationCodeShown = true;
          this._fgtPassButtonDisabled = false;
          this.form.controls["emailOrPhoneNumber"].disable();

          setTimeout(() => {
            this.form.controls["verificationCode"].addValidators([
              Validators.required,
              CustomValidators.patternValidator(/^[0-9]{6}$/, {
                hasNumber: true,
              }),
            ]);
            this.form.controls["verificationCode"].updateValueAndValidity();
          });
        });
    } else {
      this.$userClient
        .verifyCode(
          this.form.controls["emailOrPhoneNumber"].getRawValue(),
          this.form.value.verificationCode,
          true
        )
        .pipe(
          finalize(() => {
            this._fgtPassButtonDisabled = false;
          })
        )
        .subscribe((errorMessage: string) => {
          if (errorMessage) {
            this.$message.add({
              severity: "error",
              summary: "Error",
              detail: errorMessage,
            });
          } else {
            this.$message.add({
              severity: "success",
              summary: "Success",
              detail: "Correct verification code!",
            });

            this.passwordsShown = true;
            this.form.controls["verificationCode"].disable();
          }
        });
    }
  }

  get submitButtonLabel(): string {
    if (this.passwordsShown) {
      return "Change password";
    }

    return this.verificationCodeShown
      ? "Verify verification code"
      : "Send a verification code";
  }
}
