import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, NgForm, Validators } from "@angular/forms";
import { Title } from "@angular/platform-browser";
import { MessageService } from "primeng/api";
import { finalize } from "rxjs";
import {
  AuthenticationResponse,
  User,
  UserClient,
} from "src/app/ngswag/client";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
})
export class RegisterComponent implements OnInit, AfterViewInit {
  @ViewChild("form", { static: false }) form!: NgForm;
  codeValidatorDialogVisible = false;
  user?: User;

  // To change title, we need to import title service
  constructor(
    private $title: Title,
    private $fb: FormBuilder,
    private $message: MessageService,
    private $client: UserClient
  ) {
    $title.setTitle("Register");
  }

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
    }, 0);
  }

  ngOnInit(): void {}

  register(): void {
    this._registerButtonDisabled = true;

    if (this.form.value.phoneNumber.startsWith("+84")) {
      this.form.controls["phoneNumber"].setValue(
        this.form.value.phoneNumber.replace("+84", "0")
      );
    }

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

  private _registerButtonDisabled = false;
  get registerButtonDisabled(): boolean {
    return !!this.form?.invalid || this._registerButtonDisabled;
  }

  set registerButtonDisabled(value: boolean) {
    this._registerButtonDisabled = value;
  }
}
